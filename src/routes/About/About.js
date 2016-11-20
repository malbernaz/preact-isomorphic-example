import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import s from './About.scss'

const About = () => <h1 class={ s.root }>about</h1>

export default withStyles(s)(About)
