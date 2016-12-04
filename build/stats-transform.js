import { resolve } from 'path'
import { writeFileSync, mkdir } from 'fs'

export default function transform ({ assets, assetsByChunkName, hash }, { compiler }) {
  const formatedAssets = Object.keys(assetsByChunkName).reduce((obj, key) => {
    const ext = assetsByChunkName[key]
      .match(/\.\w{2,3}/)[0]
      .replace(/\./, '') // eslint-disable-line no-useless-escape

    return { ...obj, [key]: { [ext]: assetsByChunkName[key] } }
  }, {})

  const distDir = resolve(__dirname, '..', 'dist')

  // Aditional Assets File for Server comsumption
  const generateFile = () => writeFileSync(
    `${ distDir }/assets.js`,
    `module.exports = ${ JSON.stringify(formatedAssets) }`
  )

  try {
    generateFile()
  } catch (e) {
    if (e.code === 'ENOENT') {
      mkdir(distDir, generateFile)
    }
  }

  const { publicPath } = compiler.options.output

  // Assets Map File for Service Worker
  const assetsMap = assets
    .map(a => a.name)
    .map(a => `${ publicPath }${ a.split('?')[0] }`)
    .filter(a => !/worker/.test(a))

  const swAssetsMap = `self.staticAssets = ${ JSON.stringify({ hash, assets: assetsMap }) }`

  return swAssetsMap
}
