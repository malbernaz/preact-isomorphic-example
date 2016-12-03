import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import Nav from '../Nav'

import s from './Root.scss'

const Root = ({ children }) => (
  <div class={ s.root }>
    <Nav />
    { children }
  </div>
)

export default withStyles(s)(Root)
