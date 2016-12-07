import { h, Component } from 'preact'

import withStyles from '../../lib/withStyles'

import Wrapper from '../../components/Wrapper'
import Card from '../../components/Card'

import s from './Home.scss'

@withStyles(s)
export default class Home extends Component {
  static async getInitialProps () {
    return fetch('http://www.omdbapi.com/?i=tt0086250&plot=short&r=json')
      .then(response => response.json())
      .then(json => ({ json }))
  }

  state = { title: 'scarface', json: this.props.json }

  fetchMovie = event => {
    const { value } = event.target

    this.setState({ title: value })

    if (this.searchtimeout) clearTimeout(this.searchtimeout)

    this.searchtimeout = setTimeout(() =>
      fetch(`http://www.omdbapi.com/?t=${ value }&plot=short&r=json`)
        .then(response => response.json())
        .then(json => this.setState({ json }))
    , 1000)
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
        <Card json={ json } />
      </Wrapper>
    )
  }
}
