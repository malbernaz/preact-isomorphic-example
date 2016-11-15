import { h } from 'preact'

export default {
  path: '/contact',
  async action () {
    const Contact = await new Promise(resolve => {
      require.ensure([], require => resolve(require('./Contact').default), 'contact')
    })

    return {
      title: 'Contact',
      chunk: 'contact',
      component: <Contact />
    }
  }
}
