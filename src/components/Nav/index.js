import { h } from 'preact'
import { Link } from 'preact-router'

export default () =>
  <header>
    <nav>
      <Link href="/">{ ' Home ' }</Link>
      <Link href="/about">{ ' About ' }</Link>
      <Link href="/contact">{ ' Contact ' }</Link>
    </nav>
  </header>
