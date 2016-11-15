import { h } from 'preact'

import { withStyles } from '../../helpers/styles'

import s from './Contact.css'

const Contact = () => <h1 class={ s.root }>contact</h1>

export default withStyles(s)(Contact)
