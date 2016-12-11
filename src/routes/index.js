import { h } from 'preact'

import Root from '../components/Root'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import NotFound from './NotFound'

export default {
  path: '/',

  async action ({ next, preMiddleware, postMiddleware, currentRoute }) {
    if (preMiddleware) preMiddleware()

    const route = await next()

    if (postMiddleware) postMiddleware(route)

    const component = <Root currentRoute={ currentRoute }>{ route.component }</Root>

    return { ...route, component }
  },

  children: [Home, About, Contact, NotFound]
}
