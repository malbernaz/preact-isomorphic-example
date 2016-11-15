import { h } from 'preact'

import { withStyles } from '../../helpers/styles'

import s from './Home.css'

const Home = () => <h1 class={ s.root }>home</h1>

export default withStyles(s)(Home)
