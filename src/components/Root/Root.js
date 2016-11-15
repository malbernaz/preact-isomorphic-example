import { h, Component } from 'preact'
import Nav from '../Nav'

class Root extends Component { // eslint-disable-line
  componentWillMount () {
    console.log('component will mount') // eslint-disable-line
  }

  render ({ children }) {
    return (
      <div>
        <Nav />
        <div>{ children }</div>
      </div>
    )
  }
}

export default Root
