import { h, Component } from 'preact'

export default function withStyles (...styles) {
  return function wrapWithStyles (WrappedComponent) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

    return class extends Component {
      static displayName = `WithStyles(${ displayName })`

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
