import { h } from 'preact'

import { withStyles } from '../../lib/styles'

import s from './Home.css'

const Home = () => <h1 class={ s.root }>Home</h1>

export default withStyles(s)(Home)
