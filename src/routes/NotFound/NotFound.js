import { h } from 'preact'

import { withStyles } from '../../lib/styles'

import s from './NotFound.css'

const NotFound = () => <h1 class={ s.root }>not found</h1>

export default withStyles(s)(NotFound)
