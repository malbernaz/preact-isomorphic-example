import { h, Component } from 'preact'

import withStyles from '../../lib/withStyles'

import Wrapper from '../../components/Wrapper'
import Card from '../../components/Card'

import s from './Home.scss'

@withStyles(s)
export default class Home extends Component {
  static async getInitialProps () {
    const response = await fetch('http://www.omdbapi.com/?t=the%20big%20lebowski&plot=short&r=json')

    const json = await response.json()

    return { json }
  }

  state = {
    title: '',
    json: this.props.json,
    loading: false
  }

  fetchMovie = event => {
    const { value } = event.target

    this.setState({ title: value, loading: true })

    if (this.searchtimeout) clearTimeout(this.searchtimeout)

    this.searchtimeout = setTimeout(async () => {
      const response = await fetch(`http://www.omdbapi.com/?t=${ value }&plot=short&r=json`)

      const json = await response.json()

      this.setState({ json, loading: false })
    }, 1000)
  }

  render (props, { title, json }) {
    return (
      <Wrapper>
        <input
          class={ s.input }
          placeholder="search a movie..."
          type="text"
          value={ title }
          onInput={ this.fetchMovie }
        />
        { !this.state.loading ? <Card json={ json } /> : 'loading...' }
      </Wrapper>
    )
  }
}
