import { h } from 'preact'
import Link from '../Link'

import { withStyles } from '../../lib/styles'

import s from './Nav.css'

const Nav = () => (
  <header class={ s.root }>
    <Link class={ s.link } to="/">home</Link>
    <Link class={ s.link } to="/about">about</Link>
    <Link class={ s.link } to="/contact">contact</Link>
  </header>
)

export default withStyles(s)(Nav)
