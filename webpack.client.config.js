import { resolve } from 'path'
import webpack, { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'

const { optimize: { CommonsChunkPlugin, UglifyJsPlugin } } = webpack

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
    new AssetsPlugin({
      path: resolve(__dirname, 'dist'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${ JSON.stringify(x) }`
    }),
    new CommonsChunkPlugin({
      name: 'commons',
      filename: DEV ? '[name].js?[hash]' : '[name].[hash].js',
      minChunks: Infinity
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
