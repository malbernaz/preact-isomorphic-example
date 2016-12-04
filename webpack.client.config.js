import { resolve } from 'path'
import { writeFileSync } from 'fs'
import webpack, { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack'

import StyleLintPlugin from 'stylelint-webpack-plugin'
import SwPrecachePlugin from 'sw-precache-webpack-plugin'

const { optimize: { CommonsChunkPlugin, UglifyJsPlugin } } = webpack

class AssetsPlugin {
  constructor () {
    this.firstCompilation = true
  }

  apply (compiler) {
    compiler.plugin('done', stats => {
      if (this.firstCompilation) {
        const hash = stats.hash
        const rawAssets = stats.toJson().assetsByChunkName
        const scripts = {}

        Object.keys(rawAssets)
          .filter(a => /\.js/.test(rawAssets[a]))
          .forEach(a => {
            scripts[a] = { js: rawAssets[a] }
          })

        const flatAssets = Object.keys(rawAssets)
          .map(a => `/${ rawAssets[a].split('?')[0] }`)

        writeFileSync(
          resolve(__dirname, 'dist', 'public', 'staticAssets.js'),
          `self.staticAssets = ${ JSON.stringify({ hash, assets: flatAssets }) }`
        )

        writeFileSync(
          resolve(__dirname, 'dist', 'assets.js'),
          `module.exports = ${ JSON.stringify(scripts) }`
        )

        this.firstCompilation = false
      }
    })
  }
}

export default ({ DEV, baseConfig }) => ({
  ...baseConfig,
  entry: {
    ...baseConfig.entry,
    commons: [
      'preact',
      'history/createBrowserHistory',
      'universal-router'
    ]
  },
  resolve: {
    alias: {
      preact: 'preact/dist/preact.min.js',
      ...baseConfig.resolve.alias
    },
    mainFields: ['jsnext:browser', 'jsnext:main', 'browser', 'main']
  },
  output: {
    ...baseConfig.output,
    filename: DEV ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: DEV ? '[name].[id].js?[hash]' : '[name].[id].[hash].js',
    publicPath: '/'
  },
  plugins: [
    ...baseConfig.plugins,
    new AssetsPlugin(),
    new CommonsChunkPlugin({
      name: 'commons',
      minChunks: Infinity
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc.json',
      files: '**/*.s?(c)ss',
      failOnError: !DEV
    }),
    new SwPrecachePlugin({
      cacheId: 'sw-precache',
      importScripts: ['/runtime-sw.js'],
      verbose: DEV
    })
  ].concat(DEV ? [
    new HotModuleReplacementPlugin(),
    new NamedModulesPlugin()
  ] : [
    new UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      output: {
        comments: false,
        screw_ie8: true
      },
      mangle: {
        screw_ie8: true
      },
      sourceMap: true
    })
  ]),
  devServer: {
    port: 3001,
    host: '0.0.0.0',
    publicPath: '/',
    clientLogLevel: 'error',
    hot: true,
    inline: true,
    proxy: {
      '*': {
        target: 'http://0.0.0.0:3000'
      }
    }
  }
})
