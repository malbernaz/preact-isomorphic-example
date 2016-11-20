import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import s from './NotFound.scss'

const NotFound = () => <h1 class={ s.root }>not found</h1>

export default withStyles(s)(NotFound)
