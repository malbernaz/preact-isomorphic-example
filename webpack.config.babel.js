import { resolve } from 'path'
import { readdirSync } from 'fs'
import webpack, {
  DefinePlugin,
  HotModuleReplacementPlugin,
  LoaderOptionsPlugin,
  NamedModulesPlugin
} from 'webpack'

import CopyPlugin from 'copy-webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import StyleLintPlugin from 'stylelint-webpack-plugin'

const { optimize: { CommonsChunkPlugin, UglifyJsPlugin } } = webpack

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
      new StyleLintPlugin({
        configFile: '.stylelintrc.json',
        files: '**/*.s?(c)ss',
        failOnError: !DEV
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

  if (!CLIENT) {
    const externals = {
      './assets': 'commonjs ./assets'
    }

    readdirSync('node_modules')
      .filter(x => ['.bin'].indexOf(x) === -1)
      .forEach(mod => {
        externals[mod] = `commonjs ${ mod }`
      })

    return {
      ...baseConfig,
      externals,
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
          context: resolve(__dirname),
          from: './static/favicon.ico',
          to: 'public'
        }])
      ]
    }
  }

  return {
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
  }
}
