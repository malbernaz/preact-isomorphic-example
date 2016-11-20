import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import s from './Contact.scss'

const Contact = () => <h1 class={ s.root }>contact</h1>

export default withStyles(s)(Contact)
