import { h } from 'preact'

import Root from '../components/Root'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import NotFound from './NotFound'

export default {
  path: '/',

  async action ({ next }) {
    const route = await next()

    const component = <Root>{ route.component }</Root>

    return { ...route, component }
  },

  children: [Home, About, Contact, NotFound]
}
