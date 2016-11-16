import { h } from 'preact'
import Nav from '../Nav'

import { withStyles } from '../../helpers/styles'

import s from './Root.css'

const Root = ({ children }) => (
  <div>
    <Nav />
    <div>{ children }</div>
  </div>
)

export default withStyles(s)(Root)
