import { Component } from './component'

import { render_component } from './render'
import { Head } from './components'

export * from './components'

export function render(app: Component, head: Head = new Head('Pastel App')) {
  head.render()
  render_component(app)
}

export { Component }
