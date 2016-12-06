import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import Wrapper from '../../components/Wrapper'

import s from './About.scss'

const About = () => (
  <Wrapper>
    <h1 class={ s.root }>about</h1>
  </Wrapper>
)

export default withStyles(s)(About)
