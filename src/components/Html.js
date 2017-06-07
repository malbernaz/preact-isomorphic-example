import { h } from 'preact'

import config from '../config'

export default ({ chunks, commonjs, component, routeChunk, script, style, title }) => (
  <html lang={ config.lang }>
    <head>
      <meta charSet="utf-8" />

      <title>{ config.head.title }{ title && ` | ${ title }` }</title>

      <meta name="description" content={ config.head.description } />

      { config.head.meta.map(m =>
        <meta name={ m.name } content={ m.content } />
      ) }

      { config.head.customMeta.map(m =>
        <meta property={ m.property } content={ m.content } />
      ) }

      { config.head.link.map(l => (
        <link
          color={ l.color }
          href={ l.href }
          rel={ l.rel }
          sizes={ l.sizes }
          type={ l.type }
        />
      )) }

      <style id="css">{ style }</style>
    </head>
    <body>
      <main dangerouslySetInnerHTML={{ __html: component }} />

      <script src={ commonjs } defer />
      <script src={ script } defer />
      <script src={ routeChunk } defer />

      { chunks.map(c =>
        <link rel="preload" as="script" href={ c } />
      ) }
    </body>
  </html>
)
