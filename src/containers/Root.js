import { h, Component } from 'preact'
import { Router } from 'preact-router'

import Nav from '../components/Nav'
import Home from '../components/Home'
import About from '../components/About'
import Contact from '../components/Contact'
import NotFound from '../components/NotFound'

class Root extends Component {
  handleRoute = e => {
    this.currentUrl = e.url
  }

  render () {
    return (
      <div id="app">
        <Nav />
        <Router history={ this.props.history } onChange={ this.handleRoute }>
          <Home path="/" />
          <About path="/about" />
          <Contact path="/contact" />
          <NotFound default />
        </Router>
      </div>
    )
  }
}

export default Root
