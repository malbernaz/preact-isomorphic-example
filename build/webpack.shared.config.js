import path from 'path'
import webpack, { DefinePlugin, LoaderOptionsPlugin } from 'webpack'

import clientConfig from './webpack.client.config'
import serverConfig from './webpack.server.config'

const { optimize: { UglifyJsPlugin } } = webpack

const resolve = p => path.resolve(__dirname, '..', p)

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
    context: resolve('src'),
    entry: {
      main: CLIENT ? './client.js' : ['isomorphic-fetch', './server.js']
    },
    output: {
      path: resolve(CLIENT ? 'dist/public' : 'dist')
    },
    resolve: {
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat',
        preact: 'preact/dist/preact.min.js'
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
        exclude: [/node_modules/, /service-worker\.js$/],
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
          loader: 'image-webpack-loader',
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
    ].concat(!DEV ? [
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
    ] : []),
    stats: { colors: true }
  }

  return CLIENT ?
    clientConfig({ DEV, baseConfig }) :
    serverConfig({ DEV, baseConfig })
}
