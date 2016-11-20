import { h } from 'preact'
import Link from '../Link'

import withStyles from '../../lib/withStyles'

import s from './Nav.scss'

const Nav = () => (
  <header class={ s.root }>
    <Link class={ s.link } to="/">home</Link>
    <Link class={ s.link } to="/about">about</Link>
    <Link class={ s.link } to="/contact">contact</Link>
  </header>
)

export default withStyles(s)(Nav)
