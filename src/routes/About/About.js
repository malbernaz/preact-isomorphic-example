import { h } from 'preact'

import { withStyles } from '../../lib/styles'

import s from './About.css'

const About = () => <h1 class={ s.root }>about</h1>

export default withStyles(s)(About)
