import { h, render } from 'preact'
import { resolve } from 'universal-router/browser.mjs'

import Provider from './lib/ContextProvider'
import { updateTitle } from './lib/updateTag'
import history from './lib/history'
import UseScroll from './lib/middleware/useScroll'

let CURRENT_LOCATION = history.location
let FIRST_RENDER = true

const scroll = new UseScroll(CURRENT_LOCATION)

const middleware = {
  preMiddleware () {
    scroll.storeScroll(history)
  },
  postMiddleware ({ title }) {
    scroll.restoreScroll(history.location)

    updateTitle(title)
  }
}

const context = {
  insertCss (...styles) {
    const removeCss = styles.map(x => x._insertCss())

    return () => removeCss.forEach(f => f())
  }
}

const mnt = document.querySelector('main')
async function bootstrap (location) {
  if (FIRST_RENDER) {
    const node = document.getElementById('css')

    if (node) node.parentNode.removeChild(node)

    FIRST_RENDER = false
  }

  CURRENT_LOCATION = location

  const router = require('./routes').default // eslint-disable-line global-require

  const route = await resolve(router, { path: location.pathname, ...middleware })

  const component = (
    <Provider context={ context }>
      { route.component }
    </Provider>
  )

  render(component, mnt, mnt.lastElementChild)
}

history.listen(bootstrap)

bootstrap(CURRENT_LOCATION)

if (module.hot) module.hot.accept('./routes', () => bootstrap(CURRENT_LOCATION))
