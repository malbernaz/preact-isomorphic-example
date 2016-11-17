import { h } from 'preact'

import config from '../config'

export default ({ component, chunk, script, style, title }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />

      <title>{ config.head.title }{ title && ` | ${ title }` }</title>

      <meta name="description" content={ config.head.description } />

      { config.head.meta.map(m =>
        <meta name={ m.name } content={ m.content } />
      ) }

      <style id="css">{ style }</style>
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: component }} />

      <script src={ script } />
      <script src={ chunk } />
    </body>
  </html>
)
