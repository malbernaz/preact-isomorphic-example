export default class ContextProvider {
  getChildContext () {
    return this.props.context
  }

  render ({ children }) {
    // eslint-disable-next-line no-mixed-operators
    return children && children[0] || null
  }
}
