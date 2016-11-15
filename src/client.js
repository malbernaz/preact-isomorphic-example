import { render } from 'preact'
import { resolve } from 'universal-router/browser.mjs'

import history from './helpers/history'

const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(x => x._insertCss())

    return () => { removeCss.forEach(f => f()) }
  }
}

const mountPoint = document.getElementById('root')

const scrollPositionsHistory = {}

if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

function onRenderComplete (location) {
  let scrollX = 0
  let scrollY = 0
  const pos = scrollPositionsHistory[location.key]
  if (pos) {
    scrollX = pos.scrollX
    scrollY = pos.scrollY
  } else {
    const targetHash = location.hash.substr(1)
    if (targetHash) {
      const target = document.getElementById(targetHash)
      if (target) {
        scrollY = window.pageYOffset + target.getBoundingClientRect().top
      }
    }
  }

  window.scrollTo(scrollX, scrollY)

  return mountPoint.lastElementChild
}

let currentLocation = history.location

async function onLocationChange (location) {
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset
  }

  if (history.action === 'PUSH') {
    delete scrollPositionsHistory[location.key]
  }

  currentLocation = location

  const router = require('./routes').default // eslint-disable-line global-require

  const route = await resolve(router, { path: location.pathname, context })

  const { component } = route

  render(component, mountPoint, onRenderComplete(location))
}

history.listen(onLocationChange)

onLocationChange(currentLocation)

if (module.hot) module.hot.accept('./routes', () => onLocationChange(currentLocation))
