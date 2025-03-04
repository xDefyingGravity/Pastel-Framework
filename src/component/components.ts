import { Component } from './component'

export class Button extends Component {
  constructor(props: Record<string, any> = {}) {
    super(props)
    this.as('button')
  }
}

export class Header extends Component {
  constructor(level: number, props: Record<string, any> = {}) {
    super(props)
    if (level < 1 || level > 6) {
      throw new Error('Header level must be between 1 and 6')
    }
    this.as('h' + level)
  }
}

export class Paragraph extends Component {
  constructor(props: Record<string, any> = {}) {
    super(props)
    this.as('p')
  }
}

export class Text extends Component {
  constructor(text: string, props: Record<string, any> = {}) {
    super(props)
    this.text = text
  }
}

export class Div extends Component {
  constructor(props: Record<string, any> = {}) {
    super(props)
    this.as('div')
  }
}

export class Link extends Component {
  constructor(href: string = '', props: Record<string, any> = {}) {
    super(props)
    this.as('a')
    if (href) this.attributes.href = href
  }

  public withLink(href: string): Link {
    this.attributes.href = href
    return this
  }

  public withBlankTarget(): Link {
    this.attributes.target = '_blank'
    return this
  }

  public withRel(rel: string): Link {
    this.attributes.rel = rel
    return this
  }
}

export class RouterLink extends Link {
  constructor(href: string = '', props: Record<string, any> = {}) {
    super('#' + href, props)
  }

  public withLink(href: string): RouterLink {
    this.attributes.href = '#' + href
    return this
  }
}
export class Image extends Component {
  constructor(src: string, props: Record<string, any> = {}) {
    super(props)
    this.as('img')
    this.attributes.src = src
  }
  public withAlt(alt: string): Image {
    this.attributes.alt = alt
    return this
  }

  public withWidth(width: number): Image {
    this.attributes.width = width.toString()
    return this
  }

  public withHeight(height: number): Image {
    this.attributes.height = height.toString()
    return this
  }
}

export class Input extends Component {
  constructor(type: string = 'text', props: Record<string, any> = {}) {
    super()
    this.as('input')
    this.attributes.type = type
  }

  public withValue(value: string): Input {
    this.attributes.value = value
    return this
  }

  public withPlaceholder(placeholder: string): Input {
    this.attributes.placeholder = placeholder
    return this
  }

  public withRequired(): Input {
    this.attributes.required = true
    return this
  }

  public withDisabled(): Input {
    this.attributes.disabled = true
    return this
  }

  public withReadOnly(): Input {
    this.attributes.readOnly = true
    return this
  }

  public withAutofocus(): Input {
    this.attributes.autofocus = true
    return this
  }

  public withMin(min: number): Input {
    this.attributes.min = min.toString()
    return this
  }

  public withMax(max: number): Input {
    this.attributes.max = max.toString()
    return this
  }

  public onInput(callback: (event: Event) => void): Input {
    this.on('input', callback)
    return this
  }
}

export class Head {
  public title: string
  public links: { type: string; href: string; data: any }[] = []
  public meta_tags: { name: string; content: string }[] = []
  public scripts: { src: string; async: boolean }[] = []
  public styles: string[] = []

  constructor(title: string) {
    this.title = title
  }

  public addLink(type: string, href: string, data: any = {}): void {
    this.links.push({ type, href, data })
  }

  public addMeta(name: string, content: string): void {
    this.meta_tags.push({ name, content })
  }

  public addScript(src: string, async: boolean = false): void {
    this.scripts.push({ src, async })
  }

  public addStyle(style: string): void {
    this.styles.push(style)
  }

  public withLink(type: string, href: string): this {
    this.links.push({ type, href, data: {} })
    return this
  }

  public withMeta(name: string, content: string): this {
    this.meta_tags.push({ name, content })
    return this
  }

  public withScript(src: string, async: boolean = false): this {
    this.scripts.push({ src, async })
    return this
  }

  public withStyle(style: string): this {
    this.styles.push(style)
    return this
  }

  public render(): void {
    if (!this.meta_tags.some(meta => meta.name === 'viewport')) {
      this.addMeta('viewport', 'width=device-width, initial-scale=1.0')
    }
    if (!this.meta_tags.some(meta => meta.name === 'charset')) {
      this.addMeta('charset', 'utf-8')
    }

    let titleElement = document.getElementsByTagName('title')[0]
    if (!titleElement) {
      titleElement = document.createElement('title')
      document.head.appendChild(titleElement)
    }
    titleElement.textContent = this.title

    for (const meta of this.meta_tags) {
      const metaElement = document.createElement('meta')
      metaElement.setAttribute('name', meta.name)
      metaElement.setAttribute('content', meta.content)
      document.head.appendChild(metaElement)
    }

    for (const link of this.links) {
      const linkElement = document.createElement('link')
      linkElement.setAttribute('rel', link.type)
      linkElement.setAttribute('href', link.href)
      if (link.data) {
        linkElement.innerHTML = this.render_link_data(link.data)
      }
      document.head.appendChild(linkElement)
    }

    for (const script of this.scripts) {
      const scriptElement = document.createElement('script')
      scriptElement.setAttribute('src', script.src)
      if (script.async) {
        scriptElement.setAttribute('async', '')
      }
      document.head.appendChild(scriptElement)
    }

    for (const style of this.styles) {
      const styleElement = document.createElement('style')
      styleElement.textContent = style
      document.head.appendChild(styleElement)
    }
  }

  private render_link_data(data: any): string {
    return Object.entries(data)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
  }
}
