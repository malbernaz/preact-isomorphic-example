import { h } from 'preact'

import { withStyles } from '../../helpers/StyleProvider'

import s from './Home.css'

const Home = () => <h1 className={ s.root }>home</h1>

export default withStyles(s)(Home)
