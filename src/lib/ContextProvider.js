export default class ContextProvider {
  getChildContext () {
    return this.props.context
  }

  render ({ children }) {
    return children && children[0] || null // eslint-disable-line no-mixed-operators
  }
}
