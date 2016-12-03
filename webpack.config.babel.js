import { resolve } from 'path'
import { DefinePlugin, LoaderOptionsPlugin } from 'webpack'

import clientConfig from './webpack.client.config'
import serverConfig from './webpack.server.config'

export default env => {
  const CLIENT = /client/.test(env)
  const DEV = /dev/.test(env)

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: [
        ['es2015', { loose: true, modules: false }]
      ],
      plugins: [
        'async-to-promises',
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        ['transform-react-jsx', { pragma: 'h' }]
      ]
    }
  }

  const baseConfig = {
    context: resolve(__dirname, 'src'),
    entry: {
      main: CLIENT ? './client.js' : './server.js'
    },
    output: {
      path: resolve(__dirname, CLIENT ? 'dist/public' : 'dist')
    },
    resolve: {
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat'
      },
      mainFields: ['jsnext:main', 'main']
    },
    module: {
      rules: [{
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [babelLoader]
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.scss$/,
        use: [
          'isomorphic-style-loader', {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: DEV ?
                '[name]__[local]-[hash:base64:5]' : '[hash:base64:5]'
            }
          },
          'postcss-loader',
          'sass-loader'
        ],
        exclude: /node_modules/
      }, {
        test: /\.(gif|png|jpe?g|svg|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: { limit: 10000 }
        }, {
          loader: 'image-webpack',
          options: {
            progressive: true,
            optimizationLevel: 7,
            interlaced: false,
            pngquant: {
              quality: '65-90',
              speed: 4
            }
          }
        }]
      }]
    },
    bail: !DEV,
    devtool: DEV ? 'eval' : 'source-map',
    plugins: [
      new LoaderOptionsPlugin({
        minimize: !DEV,
        debug: DEV,
        options: {
          postcss: () => [
            require('autoprefixer')({ browsers: ['last 2 versions'] }),
            require('cssnano')({ zindex: false })
          ]
        }
      }),
      new DefinePlugin({
        _DEV_: DEV,
        _CLIENT_: CLIENT,
        'process.env.NODE_ENV': JSON.stringify(DEV ? 'development' : 'production')
      })
    ],
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: true,
      assets: true,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: false,
      errorDetails: false,
      warnings: false,
      publicPath: false
    }
  }

  return CLIENT ?
    clientConfig({ DEV, baseConfig }) :
    serverConfig({ DEV, baseConfig })
}
