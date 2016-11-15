/* eslint-disable react/no-multi-comp */

import { h, Component } from 'preact'

export class StyleProvider extends Component {
  getChildContext () {
    return this.props.context
  }

  render ({ children }) {
    return children && children[0] || null // eslint-disable-line no-mixed-operators
  }
}

export function withStyles (...styles) {
  return function wrapWithStyles (WrappedComponent) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

    return class extends Component {
      static displayName = `WithStyles(${displayName})`

      componentWillMount () {
        this.removeCss = this.context.insertCss.apply(undefined, styles)
      }

      componentWillUnmount () {
        setTimeout(this.removeCss, 0)
      }

      render () {
        return <WrappedComponent { ...this.props } />
      }
    }
  }
}
