import { h, Component } from 'preact'

import withStyles from '../../lib/withStyles'

import Nav from '../Nav'

import s from './Root.scss'

class Root extends Component { // eslint-disable-line
  render ({ children, currentRoute }) {
    return (
      <div class={ s.root }>
        <Nav currentRoute={ currentRoute } />
        { children }
      </div>
    )
  }
}

export default withStyles(s)(Root)
