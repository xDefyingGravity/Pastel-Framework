import { Component, Head, render } from '../component'
import { call_all_destroys, render_component } from '../component/render'

export class Router {
  private routes: Record<string, Component> = {}
  private current_route: Component
  private current_hash: string = window.location.hash
  public head: Head
  private did_halt_destroy: boolean = false

  private parse_hash(hash: string): string | null {
    return hash.split('#')[1] ?? null
  }

  constructor(routes: Record<string, Component>, head: Head) {
    const initialRoute = this.parse_hash(window.location.hash) ?? '/'
    this.routes = routes
    this.head = head
    this.current_route =
      this.routes[initialRoute] || this.routes['/'] || this.routes['/default']
  }

  public listen() {
    window.addEventListener('hashchange', e => {
      this.handle_hashchange(
        window.location.hash,
        this.parse_hash(e.oldURL) || '/',
      )
    })
    render(this.current_route, this.head)
  }

  public navigate(route: string) {
    window.location.hash = route
  }

  private handle_hashchange(hash: string, old_hash: string) {
    if (this.did_halt_destroy) {
      this.did_halt_destroy = false
      return
    }
    const route = this.parse_hash(hash)
    const prev_route = this.current_route
    const halt = call_all_destroys(prev_route)
    if ((halt as unknown as any) === true && !window.PASTEL_NO_ROUTE_HALT) {
      if (!window.PASTEL_NO_ROUTE_HALT_WARN)
        console.warn(
          `we attempted to destroy ${old_hash}, but it halted the process of rendering the next route.\nto disable this, set window.PASTEL_NO_ROUTE_HALT to true,\nor, to just disable the warning, set window.PASTEL_NO_ROUTE_HALT_WARN to true`,
        )
      window.location.hash = old_hash
      this.did_halt_destroy = true
      return
    }

    if (route === null || !this.routes[route]) {
      this.current_route =
        this.routes['/404'] ||
        this.routes['/default'] ||
        this.routes['/']
    } else {
      this.current_route = this.routes[route]
    }

    render_component(this.current_route, true)
  }
}
