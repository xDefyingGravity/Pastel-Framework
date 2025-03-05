import { $reactive } from '../state'

export class Component {
  static counter: number = 0

  public id: string = `c-${Component.counter++}`
  public tagName: string = 'div'
  public className: string = ''
  public children: Component[] = []
  public attributes: Record<string, string | number | boolean> = {}
  public state: $reactive<Record<any, any>> = new $reactive<Record<any, any>>(
    {},
  )
  public events: Record<string, (event: Event) => void> = {}
  public text: string = ''
  public parent: Component | null = null
  public onRenderFunctions: (() => any)[] = []
  public onUpdateFunctions: (() => any)[] = []
  public onDestroyFunctions: (() => any | boolean)[] = [];
  public styles: Record<string, string | number | boolean> = {}

  constructor(props: Record<string, any> = {}) {
    for (const key in props) {
      this.state.set(key, props[key])
    }
  }

  public onRender(func: () => any) {
    this.onRenderFunctions.push(func)
    return this
  }
  public onUpdate(func: () => any) {
    this.onUpdateFunctions.push(func)
    return this
  }
  public onDestroy(func: () => any | boolean) {
    this.onDestroyFunctions.push(func)
    return this
  }

  public withId(id: string): this {
    this.id = id
    return this
  }

  public withClassName(className: string): this {
    this.className = this.className + ' ' + className
    return this
  }

  public withChild(child: Component): this {
    child.parent = this
    this.children.push(child)
    return this
  }

  public withChildren(...children: Component[]): this {
    for (const child of children) {
      this.withChild(child)
    }
    return this
  }

  public withStyles(styles: Record<string, string | number | boolean>): this {
    this.styles = { ...this.styles, ...styles }
    return this
  }

  public withClassNames(...classNames: string[]): this {
    classNames.map(this.withClassName.bind(this))
    return this
  }

  public withAttribute(key: string, value: string): this {
    this.attributes[key] = value
    return this
  }

  public withAttributes(attributes: Record<string, string>): this {
    Object.keys(attributes).map(key => this.withAttribute(key, attributes[key]))
    return this
  }

  public on(
    event: keyof GlobalEventHandlersEventMap,
    callback: (event: Event) => void,
  ): this {
    if (!this.events[event]) {
      this.events[event] = callback
    } else {
      const prev_callback = this.events[event]
      this.events[event] = (e: Event) => {
        prev_callback(e)
        callback(e)
      }
    }
    return this
  }

  public onClick(callback: (event: Event) => void): this {
    this.on('click', callback)
    return this
  }

  public onEnter(callback: (event: Event) => void): this {
    this.on('mouseenter', callback)
    return this
  }

  public onLeave(callback: (event: Event) => void): this {
    this.on('mouseleave', callback)
    return this
  }

  public onFocus(callback: (event: Event) => void): this {
    this.on('focus', callback)
    return this
  }

  public as(tagName: string): this {
    this.tagName = tagName;
    return this
  }

  public onBlur(callback: (event: Event) => void): this {
    this.on('blur', callback)
    return this
  }

  public onDoubleClick(callback: (event: Event) => void): this {
    this.on('dblclick', callback)
    return this
  }

  public onMouseDown(callback: (event: Event) => void): this {
    this.on('mousedown', callback)
    return this
  }

  public onMouseUp(callback: (event: Event) => void): this {
    this.on('mouseup', callback)
    return this
  }

  public onMouseMove(callback: (event: Event) => void): this {
    this.on('mousemove', callback)
    return this
  }

  public withText(text: string): this {
    this.text = text
    return this
  }
}
