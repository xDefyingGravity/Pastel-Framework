import { render_component } from '../src/component/render'
import { Component } from '../src/component/component'
import { describe, it, expect, beforeEach, beforeAll } from 'bun:test'

describe('render_component', () => {
  let component: Component
  let originalBody: HTMLElement

  beforeEach(() => {
    component = new Component()
    originalBody = document.body
    document.body.innerHTML = ''
  })

  it('should append component to document body', () => {
    render_component(component)
    expect(document.body.children.length).toBe(1)
  })

  it('should render component with id', () => {
    component.withId('test-component')
    render_component(component)
    expect(document.body.children[0].id).toBe('test-component')
  })

  it('should handle multiple components being rendered', () => {
    const component1 = new Component().withId('first')
    const component2 = new Component().withId('second')

    render_component(component1)
    render_component(component2)

    expect(document.body.children.length).toBe(2)
    expect(document.body.children[0].id).toBe('first')
    expect(document.body.children[1].id).toBe('second')
  })

  it('should render component when document body is empty', () => {
    document.body.innerHTML = ''
    render_component(component)
    expect(document.body.children.length).toBe(1)
  })

  it('should preserve existing content in document body', () => {
    const existingDiv = document.createElement('div')
    document.body.appendChild(existingDiv)

    render_component(component)

    expect(document.body.children.length).toBe(2)
    expect(document.body.children[0]).toBe(existingDiv)
  })

  it('should handle state updates', () => {
    const component = new Component().as('button').withText('Count: {{count}}')

    // Initialize state
    component.state.set('count', 0)

    // Set up click handler
    component.onClick((event: Event) => {
      const count = component.state.get('count') ?? 0
      component.state.set('count', count + 1)
    })

    // Render the component
    render_component(component)

    // Find the button
    const button = document.body.children[0] as HTMLButtonElement

    button.click()

    console.log('Button clicked!')
    expect(document.body.children[0].textContent).toBe('Count: 1')
  })
})
