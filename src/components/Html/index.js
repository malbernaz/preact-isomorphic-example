import { h } from 'preact'

export default ({ children }) =>
  <html lang="en">
    <head>
      <title>preact isomorphic example</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
    </head>
    <body>
      <div id="root">
        { children }
      </div>
      <script src="bundle.js" />
    </body>
  </html>
