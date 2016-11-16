import { h } from 'preact'
import Link from '../Link'

import { withStyles } from '../../lib/styles'

import s from './Nav.css'

const Nav = () =>
  <header class={ s.root }>
    <Link to="/">{ ' Home ' }</Link>
    <Link to="/about">{ ' About ' }</Link>
    <Link to="/contact">{ ' Contact ' }</Link>
  </header>

export default withStyles(s)(Nav)
