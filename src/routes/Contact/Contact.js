import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import Wrapper from '../../components/Wrapper'

import s from './Contact.scss'

const Contact = () => (
  <Wrapper>
    <h1 class={ s.root }>contact</h1>
  </Wrapper>
)

export default withStyles(s)(Contact)
