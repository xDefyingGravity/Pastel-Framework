/// <reference path="../global.d.ts" />
import { Component } from './component'
import { apply_diffs } from '../diff'
import { render_template } from '../templates'
import { $reactive } from '../state'
import { Pipeline } from '../pipeline'

let is_rendering = false;
let global_styles: {
  [key: string]: {
    [key: string]: any;
  };
} = {};

function render_styles() {
  let element = document.getElementById('pastel__global_styles');
  if (!element) {
    element = document.createElement('style');
    element.id = 'pastel__global_styles';
    document.head.appendChild(element);
  }

  element.textContent = Object.entries(global_styles)
    .map(([key, value]: [string, Record<string, string>]) =>
      `#${key} { ${Object.entries(value).map(([prop, val]) => `${prop}: ${val}`).join('; ')} }`
    )
    .join('\n');
}

export function collect_all_states(component: Component): $reactive<any> {
  let parent: Component
  let state: $reactive<any> = new $reactive<any>({})
  parent = component
  while (parent) {
    state = $reactive.merge(state, parent.state)
    parent = parent.parent!
  }
  return state
}

export function apply_pipelines(
  component: Component,
  pipelines: Pipeline[],
): Component {
  for (const pipeline of pipelines) {
    if (pipeline.allows(component)) {
      pipeline.apply(component)
    }
  }
  return component
}
export function pastel_element_to_html(
  component: Component,
  is_start: boolean = false,
): HTMLElement {
  if (window.pastel?.pipelines)
    component = apply_pipelines(component, window.pastel?.pipelines)
  const { tagName, attributes, children, events, text } = component
  let { className, styles } = component;
  const state = collect_all_states(component)
  const element = document.createElement(tagName)

  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') {
      className += ' ' + render_template(value.toString(), state.getAll())
      continue
    }
    element.setAttribute(key, render_template(value.toString(), state.getAll()))
  }

  if (styles && global_styles[component.id] !== styles && Object.keys(styles).length > 0) {
    global_styles[component.id] = styles;
    render_styles();
  }
  element.className = render_template(className, state.getAll())
  if (text) {
    element.textContent = text
  }

  element.innerText = render_template(element.innerText, state.getAll())

  for (const child of children) {
    element.appendChild(pastel_element_to_html(child, is_start))
  }

  for (const [event, callback] of Object.entries(events)) {
    element.addEventListener(event, callback)
  }

  if (is_start && component.state) {
    component.state.subscribe(() => {
      if (is_rendering) return

      is_rendering = true
      apply_diffs(element, pastel_element_to_html(component))
      call_all_updates(component)
      is_rendering = false
    })
  }

  element.id = component.id
  return element
}

function call_all_renders(component: Component) {
  for (const func of component.onRenderFunctions) {
    if (typeof func !== 'function') {
      console.warn('[pastel] onRender function is not a function')
      continue
    }
    func()
  }
  for (const child of component.children) {
    call_all_renders(child)
  }
}

export function call_all_destroys(component: Component) {
  let output: any = null
  for (const func of component.onDestroyFunctions) {
    if (typeof func !== 'function') {
      console.warn('[pastel] onDestroy function is not a function')
      continue
    }
    output = func() ?? false
  }
  for (const child of component.children) {
    call_all_destroys(child)
  }
  return output
}

function call_all_updates(component: Component) {
  if (
    component.onUpdateFunctions.length > 50 &&
    !window.PASTEL_NO_PERFORMANCE_WARN
  ) {
    console.warn(
      '[pastel] you have more than 50 onUpdate functions, this is not recommended for performance reasons\nyou can disable this warning by setting window.PASTEL_NO_PERFORMANCE_WARN to true',
    )
  }
  for (const func of component.onUpdateFunctions) {
    if (typeof func !== 'function') {
      console.warn('[pastel] onUpdate function is not a function')
      continue
    }
    func()
  }
  for (const child of component.children) {
    call_all_updates(child)
  }
}

export function render_component(
  component: Component,
  erase_existing: boolean = false,
): void {
  if (is_rendering) return

  is_rendering = true
  if (component.state.isNull()) component.state.init()
  call_all_renders(component)
  const element = pastel_element_to_html(component, true)

  window.addEventListener('beforeunload', (event) => {
    let output = call_all_destroys(component);
    if (output) event.preventDefault();
  })

  if (erase_existing) document.body.innerHTML = ''
  document.body.appendChild(element)
  is_rendering = false
}
