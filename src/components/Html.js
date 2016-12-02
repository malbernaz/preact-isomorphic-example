import { h } from 'preact'

import config from '../config'

export default ({
  chunks,
  commonjs,
  component,
  routeChunk,
  script,
  style,
  title
}) => (
  <html lang={ config.lang }>
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
      <main dangerouslySetInnerHTML={{ __html: component }} />

      <script src={ commonjs } defer />
      <script src={ script } defer />
      <script src={ routeChunk } defer />

      { chunks.map(c =>
        <link as="script" href={ c } rel="preload" />
      ) }
    </body>
  </html>
)
