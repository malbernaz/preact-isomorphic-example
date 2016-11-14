import { h } from 'preact'

export default ({ component, css }) =>
  <html lang="en">
    <head>
      <title>preact isomorphic example</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <style>{ css.join('') }</style>
    </head>
    <body>
      <div id="root">
        { component }
      </div>
      <script src="bundle.js" />
    </body>
  </html>
