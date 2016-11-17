import { h, render } from 'preact'
import { resolve } from 'universal-router/browser.mjs'

import { StyleProvider } from './lib/styles'
import { updateTitle } from './lib/updateTag'
import history from './lib/history'

let CURRENT_LOCATION = history.location
let FIRST_RENDER = true

const context = {
  insertCss (...styles) {
    const removeCss = styles.map(x => x._insertCss())

    return () => { removeCss.forEach(f => f()) }
  }
}

const mountPoint = document.getElementById('root')

async function bootstrap (location) {
  if (FIRST_RENDER) {
    const node = document.getElementById('css')

    if (node) node.parentNode.removeChild(node)

    FIRST_RENDER = false
  }

  CURRENT_LOCATION = location

  const router = require('./routes').default // eslint-disable-line global-require

  const route = await resolve(router, { path: location.pathname, history })

  const component = (
    <StyleProvider context={ context }>
      { route.component }
    </StyleProvider>
  )

  render(component, mountPoint, mountPoint.lastElementChild)

  updateTitle(route.title)
}

history.listen(bootstrap)

bootstrap(CURRENT_LOCATION)

if (module.hot) module.hot.accept('./routes', () => bootstrap(CURRENT_LOCATION))
