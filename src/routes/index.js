import { h } from 'preact'

import Root from '../components/Root'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import NotFound from './NotFound'

import { StyleProvider } from '../helpers/styles'

export default {
  path: '/',

  async action ({ next, context }) {
    const route = await next()

    const component = (
      <StyleProvider context={ context } key="style-provider">
        <Root>{ route.component }</Root>
      </StyleProvider>
    )

    return { ...route, component }
  },

  children: [Home, About, Contact, NotFound]
}
