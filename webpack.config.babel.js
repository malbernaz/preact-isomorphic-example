/* eslint-disable global-require */

import { resolve } from 'path'
import { readdirSync } from 'fs'
import { LoaderOptionsPlugin, DefinePlugin, NamedModulesPlugin } from 'webpack'

import CopyPlugin from 'copy-webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import StylelintPlugin from 'stylelint-webpack-plugin'

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
    entry: CLIENT ? './client.js' : './server.js',
    output: {
      path: resolve(__dirname, CLIENT ? 'dist/public' : 'dist')
    },
    module: {
      rules: [{
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [babelLoader]
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.css$/,
        loaders: [
          'isomorphic-style-loader', {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: DEV ?
                '[name]__[local]-[hash:base64:5]' : '[hash:base64:5]'
            }
          },
          'postcss-loader'
        ],
        exclude: /node_modules/
      }, {
        test: /\.(gif|png|jpe?g|svg|woff|woff2)$/,
        loaders: [{
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
          postcss (compiler) {
            return [
              require('postcss-import')({ addDependencyTo: compiler }),
              require('postcss-css-variables')(),
              require('rucksack-css')(),
              require('autoprefixer')({ browsers: ['last 2 versions'] }),
              require('cssnano')({ zindex: false })
            ]
          }
        }
      }),
      new DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(!DEV ? 'production' : 'development')
        },
        _DEV_: DEV,
        _CLIENT_: CLIENT
      })
    ]
  }

  if (!CLIENT) {
    const nodeModules = {}

    readdirSync('node_modules')
      .filter(x => ['.bin'].indexOf(x) === -1)
      .forEach(mod => {
        nodeModules[mod] = `commonjs ${ mod }`
      })

    return {
      ...baseConfig,
      externals: nodeModules,
      target: 'node',
      output: {
        ...baseConfig.output,
        filename: 'index.js'
      },
      node: {
        __dirname: false,
        __filename: false
      },
      plugins: [
        ...baseConfig.plugins,
        new CopyPlugin([{
          from: 'static/favicon.ico',
          to: 'public'
        }])
      ]
    }
  }

  return {
    ...baseConfig,
    output: {
      ...baseConfig.output,
      filename: DEV ? '[name].js?[hash]' : '[name].[hash].js',
      chunkFilename: DEV ? '[name].[id].js?[hash]' : '[name].[id].[hash].js',
      publicPath: '/'
    },
    plugins: [
      ...baseConfig.plugins,
      new StylelintPlugin({
        configFile: '.stylelintrc.json',
        files: ['**/*.css'],
        failOnError: !DEV
      }),
      new AssetsPlugin({
        path: resolve(__dirname, 'dist'),
        filename: 'assets.js',
        processOutput: x => `module.exports = ${ JSON.stringify(x) }`
      }),
      DEV && new NamedModulesPlugin()
    ],
    devServer: {
      port: 3001,
      host: '0.0.0.0',
      publicPath: '/',
      clientLogLevel: 'error',
      proxy: {
        '*': {
          target: 'http://0.0.0.0:3000'
        }
      }
    }
  }
}
