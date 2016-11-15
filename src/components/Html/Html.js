import { h, Component } from 'preact'

export default class Html extends Component { // eslint-disable-line
  render ({ component, script, chunk, title, css }) {
    return (
      <html lang="en">
        <head>
          <title>preact isomorphic example | { title }</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
          { css && <style id="css" dangerouslySetInnerHTML={{ __html: [...css].join() }} /> }
        </head>
        <body>
          <div id="root">
            { component }
          </div>
          <script src={ script } />
          { chunk && <script rel="preload" src={ chunk } /> }
        </body>
      </html>
    )
  }
}
