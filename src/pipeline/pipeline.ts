import type { Component } from '../component'

export class Pipeline {
  public avoided: Component[] = []
  private _whitelist: string[] | null = null
  private _blacklist: string[] | null = null
  constructor(
    public steps: {
      modifier: 'className' | 'attribute' | 'text' | 'id' | 'attributes' | 'style'
      function: (value: any) => any
      whitelist?: string[]
      blacklist?: string[]
      avoided?: Component[]
    }[],
  ) {}
  public apply(component: Component): Component {
    if (this.steps.length > 50 && !window.PASTEL_NO_PIPELINE_WARN) {
      console.warn(
        '[pastel] pipeline has more than 50 steps, this may cause performance issues\nyou can disable this warning by setting window.PASTEL_NO_PIPELINE_WARN to true',
      )
    }
    for (const step of this.steps) {
      if (typeof step.function !== 'function') {
        console.warn('[pastel] pipeline step is not a function')
      }

      if (!this.allows(component, step)) {
        continue;
      }

      switch (step.modifier) {
        case 'className':
          component.className = step.function(component.className)
          break
        case 'attribute':
          for (const attribute of Object.keys(component.attributes)) {
            component.attributes[attribute] = step.function(
              component.attributes[attribute],
            )
          }
          break
        case 'attributes':
          component.attributes = step.function(component.attributes)
          break
        case 'text':
          component.text = step.function(component.text)
          break
        case 'id':
          component.id = step.function(component.id)
          break
        case 'style':
          component.styles = step.function(component.styles)
          break
        default:
          console.warn('[pastel] unknown pipeline modifier: ' + step.modifier)
          break
      }
    }

    return component
  }

  public avoid(component: Component) {
    this.avoided.push(component)
    return this
  }

  public whitelist(tagNames: string[]) {
    this._whitelist = [...(this._whitelist || []), ...tagNames]
    return this
  }

  public blacklist(tagNames: string[]) {
    this._blacklist = [...(this._blacklist || []), ...tagNames]
    return this
  }

  private has(list: string[], classes: string[], id: string, tagName: string): boolean {
    const set = new Set(list);
    return set.has(tagName) || classes.some(cls => set.has(cls)) || set.has(id);
  }

  public allows(component: Component, obj: any = this): boolean {
    const tag = component.tagName;
    const { className, id } = component;
    const classes = className.split(" ").map(c => "." + c);

    const whitelist = Array.isArray(obj._whitelist) ? obj._whitelist : (Array.isArray(obj.whitelist) ? obj.whitelist : null);
    const blacklist = Array.isArray(obj._blacklist) ? obj._blacklist : (Array.isArray(obj.blacklist) ? obj.blacklist : []);
    const avoided = Array.isArray(obj.avoided) ? obj.avoided : [];

    const whitelist_has = whitelist && this.has(whitelist, classes, "#" + id, tag);
    const blacklist_has = blacklist && this.has(blacklist, classes, id, tag);
    const avoided_has = avoided.includes(component);
    return !blacklist_has && !avoided_has && (whitelist_has || !whitelist);
  }


  public mount() {
    if (!window.pastel) window.pastel = {}
    window.pastel.pipelines = window.pastel.pipelines || []
    window.pastel.pipelines.push(this)
  }

  public unmount(): void {
    if (
      !window.pastel ||
      !window.pastel.pipelines ||
      !window.pastel.pipelines.length ||
      !window.pastel.pipelines.includes(this)
    ) {
      console.warn(
        '[pastel] this pipeline is not mounted, but you are trying to unmount it',
      )
      return
    }
    window.pastel.pipelines = window.pastel.pipelines.filter(
      pipeline => pipeline !== this,
    )
  }
}
