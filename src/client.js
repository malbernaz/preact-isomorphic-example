import { h, render } from 'preact'

import { StyleProvider } from './helpers/StyleProvider'

const mountPoint = document.getElementById('root')

function init () {
  const Root = require('./containers/Root').default // eslint-disable-line global-require

  const component = (
    <StyleProvider onInsertCss={ s => s._insertCss() }>
      <Root />
    </StyleProvider>
  )

  render(component, mountPoint, mountPoint.lastElementChild)
}

init()

if (module.hot) module.hot.accept('./containers/Root', init)
