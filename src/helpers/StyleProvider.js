import { h, Component } from 'preact'

export class StyleProvider extends Component {
  getChildContext () {
    return { insertCss: this.props.onInsertCss }
  }

  render ({ children }) {
    return children && children[0] || null // eslint-disable-line
  }
}

export function css (string) {
  return string.raw[0]
}

export function withStyles (...styles) {
  return function wrapWithStyles (ComposedComponent) {
    const displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component'

    class WithStyles extends Component { // eslint-disable-line
      static displayName = `WithStyles(${displayName})`

      componentWillMount () {
        this.removeCss = this.context.insertCss.apply(undefined, styles)
      }

      componentWillUnmount () {
        setTimeout(this.removeCss, 0)
      }

      render () {
        return <ComposedComponent { ...this.props } />
      }
    }

    return WithStyles
  }
}

// export function withStyles (style) {
//   return function (WrappedComponent) {
//     const provide = {
//       _getCss () {
//         return style
//       },
//       _insertCss () {
//         // document.head.querySelector('style').innerText = style
//         return style
//       }
//     }
//
//     class WithStyles extends Component { // eslint-disable-line
//       constructor (props, context) {
//         super(props, context)
//
//         this.context.insertCss(provide)
//       }
//
//       render () {
//         return <WrappedComponent { ...this.props } />
//       }
//     }
//
//     const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
//
//     WithStyles.displayName = `WithStyles(${displayName})`
//
//     return WithStyles
//   }
// }
