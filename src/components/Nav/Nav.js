import { h } from 'preact'
import Link from '../Link'

import withStyles from '../../lib/withStyles'

import s from './Nav.scss'

const NavLink = props => (
  <Link class={ props.currentRoute === props.to ? s.linkActive : s.link } { ...props }>
    { props.children }
  </Link>
)

const Nav = ({ currentRoute }) => (
  <header class={ s.root }>
    <NavLink currentRoute={ currentRoute } to="/">home</NavLink>
    <NavLink currentRoute={ currentRoute } to="/about">about</NavLink>
    <NavLink currentRoute={ currentRoute } to="/contact">contact</NavLink>
  </header>
)

export default withStyles(s)(Nav)
