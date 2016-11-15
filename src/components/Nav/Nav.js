import { h } from 'preact'
import Link from '../Link'

export default () =>
  <header>
    <Link to="/">{ ' Home ' }</Link>
    <Link to="/about">{ ' About ' }</Link>
    <Link to="/contact">{ ' Contact ' }</Link>
  </header>
