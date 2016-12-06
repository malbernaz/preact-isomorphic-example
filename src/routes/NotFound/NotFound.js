import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import Wrapper from '../../components/Wrapper'

import s from './NotFound.scss'

const NotFound = () => (
  <Wrapper>
    <h1 class={ s.root }>not found</h1>
  </Wrapper>
)

export default withStyles(s)(NotFound)
