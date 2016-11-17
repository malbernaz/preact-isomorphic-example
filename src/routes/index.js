import { h } from 'preact'

import Root from '../components/Root'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import NotFound from './NotFound'

let useScroll

const preMiddleware = _CLIENT_ ? function clientPreMiddleware ({ history }) {
  if (!useScroll) {
    const UseScroll = require('../lib/middleware/useScroll').default

    useScroll = new UseScroll(history.location)
  }

  useScroll.storeScroll(history)
} : f => f

const postMiddleware = _CLIENT_ ? function clientPostMiddleware ({ history }) {
  useScroll.restoreScroll(history.location)
} : f => f

export default {
  path: '/',

  async action ({ next, history }) {
    preMiddleware({ history })

    const route = await next()

    postMiddleware({ history })

    const component = <Root>{ route.component }</Root>

    return { ...route, component }
  },

  children: [Home, About, Contact, NotFound]
}
