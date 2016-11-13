import { h, render } from 'preact'

const mountPoint = document.getElementById('root')

function init () {
  const Root = require('./containers/Root').default // eslint-disable-line global-require

  render(<Root />, mountPoint, mountPoint.lastElementChild)
}

init()

if (module.hot) {
  module.hot.accept('./containers/Root', init)
}
