import { resolve } from 'path'
import { readdirSync } from 'fs'
import CopyPlugin from 'copy-webpack-plugin'

export default env => {
  const CLIENT = /client/.test(env)
  const PROD = /prod/.test(env)

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
        loader: 'babel-loader'
      }]
    },
    bail: PROD,
    devtool: PROD ? 'source-map' : 'cheap-module-eval-source-map',
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
