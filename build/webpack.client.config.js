import { resolve } from 'path'
import webpack, { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack'

import { StatsWriterPlugin as StatsPlugin } from 'webpack-stats-plugin'
import StyleLintPlugin from 'stylelint-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

import transform from './stats-transform'

const { optimize: { CommonsChunkPlugin, UglifyJsPlugin } } = webpack

export default ({ DEV, baseConfig, babelLoader }) => ({
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
  module: {
    rules: [
      ...baseConfig.module.rules, {
        test: /service-worker\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'worker-loader',
          options: { service: true }
        }, babelLoader]
      }
    ]
  },
  plugins: [
    ...baseConfig.plugins,
    new StatsPlugin({
      filename: 'assets.js',
      fields: ['assets', 'assetsByChunkName', 'hash'],
      transform
    }),
    new CommonsChunkPlugin({
      name: 'commons',
      minChunks: Infinity
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc.json',
      files: '**/*.s?(c)ss',
      failOnError: !DEV
    }),
    new CopyPlugin([{
      context: resolve(__dirname, '..', 'static'),
      from: '**/*',
      to: resolve(__dirname, '..', 'dist', 'public')
    }])
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
