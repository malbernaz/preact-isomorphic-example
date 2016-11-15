import { h } from 'preact'

export default {
  path: '*',
  async action () {
    const NotFound = await new Promise(resolve => {
      require.ensure([], require => resolve(require('./NotFound').default), 'notfound')
    })

    return {
      title: 'Not Found',
      chunk: 'notfound',
      component: <NotFound />
    }
  }
}
