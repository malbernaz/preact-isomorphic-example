import { h, Component } from 'preact'

import withStyles from '../../lib/withStyles'

import Wrapper from '../../components/Wrapper'

import s from './Home.scss'

@withStyles(s)
export default class Home extends Component {
  static async getInitialProps () {
    return { hello: 'little fella' }
  }

  render ({ hello }) {
    return (
      <Wrapper>
        <h1 class={ s.root }>
          Say hello to my { hello }!
        </h1>
      </Wrapper>
    )
  }
}
