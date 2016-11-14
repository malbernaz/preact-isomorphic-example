import { resolve } from 'path'
import { readdirSync } from 'fs'
import { LoaderOptionsPlugin } from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import autoprefixer from 'autoprefixer'

export default env => {
  const CLIENT = /client/.test(env)
  const PROD = /prod/.test(env)

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: [
        ['es2015', { loose: true, modules: false }],
      ],
      plugins: [
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-decorators-legacy',
        ['transform-react-jsx', { pragma: 'h' }]
      ]
    }
  }

  const baseConfig = {
    context: resolve(__dirname, 'src'),
    entry: CLIENT ? './client.js' : './server.js',
    output: {
      path: resolve(__dirname, CLIENT ? 'dist/public' : 'dist'),
      filename: CLIENT ? 'bundle.js' : 'index.js'
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
        test: /\.css$/,
        loaders: [
          'isomorphic-style-loader', {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: PROD ?
                '[hash:base64:5]' : '[name]__[local]-[hash:base64:5]'
            }
          },
          'postcss-loader'
        ],
        exclude: /node_modules/
      }]
    },
    bail: PROD,
    devtool: PROD ? 'source-map' : 'eval',
    plugins: [
      new LoaderOptionsPlugin({
        minimize: PROD,
        debug: !PROD,
        options: {
          postcss: () => [
            autoprefixer({ browsers: ['last 2 versions'] }),
          ]
        }
      })
    ]
  }

  if (!CLIENT) {
    const nodeModules = {}

    readdirSync('node_modules')
      .filter(x => ['.bin'].indexOf(x) === -1)
      .forEach(mod => {
        nodeModules[mod] = `commonjs ${mod}`
      })

    return {
      ...baseConfig,
      externals: nodeModules,
      target: 'node',
      node: {
        __dirname: false,
        __filename: false
      },
      plugins: [
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
      publicPath: '/',
    },
    devServer: {
      port: 3001,
      host: '0.0.0.0',
      colors: true,
      publicPath: '/',
      clientLogLevel: 'none',
      proxy: {
        '*': {
          target: 'http://0.0.0.0:3000'
        }
      }
    }
  }
}
