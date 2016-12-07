import { h } from 'preact'

import withStyles from '../../lib/withStyles'

import s from './Card.scss'

const Card = ({ json }) => json.Response === 'True' ?
  <div class={ s.root }>
    <div class={ s.poster }>
      <img src={ json.Poster } alt={ json.Poster } />
    </div>
    <div class={ s.info }>
      <div class={ s.title }>
        <h2>title:</h2>
        <p>{ json.Title }</p>
      </div>
      <div class={ s.plot }>
        <h2>plot:</h2>
        <p>{ json.Plot }</p>
      </div>
      <div class={ s.director }>
        <h2>director:</h2>
        <p>{ json.Director }</p>
      </div>
      <div class={ s.actors }>
        <h2>actors:</h2>
        <ul>
          { json.Actors.split(',').map(a => <li>{ a }</li>) }
        </ul>
      </div>
    </div>
  </div> :
  <div class={ s.root }>
    <div class={ s.info }>
      <h2>{ json.Error }</h2>
    </div>
  </div>

export default withStyles(s)(Card)
