import history from '../history'

export default class ScrollMiddleware {
  constructor () {
    this.scrollPositionsHistory = {}
    this.history = history
    this.currentLocation = history.location
    this.firstRender = true
  }

  storeScroll (location) {
    this.scrollPositionsHistory[this.currentLocation.key] = {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset
    }

    if (this.history.action === 'PUSH') {
      delete this.scrollPositionsHistory[location.key]
    }

    this.currentLocation = location
  }

  restoreScroll (location) {
    let scrollX = 0
    let scrollY = 0
    const pos = this.scrollPositionsHistory[location.key]

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
  }
}
