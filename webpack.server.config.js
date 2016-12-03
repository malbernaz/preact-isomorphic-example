import { resolve } from 'path'
import { readdirSync } from 'fs'
import CopyPlugin from 'copy-webpack-plugin'

export default ({ baseConfig }) => {
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
        context: resolve(__dirname, 'static'),
        from: '**/*',
        to: resolve(__dirname, 'dist', 'public')
      }])
    ]
  }
}
