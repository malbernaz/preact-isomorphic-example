import { h } from 'preact'

export default {
  path: '/about',
  async action () {
    const About = await new Promise(resolve => {
      require.ensure([], require => resolve(require('./About').default), 'about')
    })

    return {
      title: 'About',
      chunk: 'about',
      component: <About />
    }
  }
}
