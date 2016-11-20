import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import s from './Home.scss'

const Home = () => <h1 class={ s.root }>home</h1>

export default withStyles(s)(Home)
