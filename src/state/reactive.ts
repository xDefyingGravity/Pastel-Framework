export class $reactive<T> {
  private listeners: Set<Function> = new Set()
  public static all = Symbol('all')

  constructor(private value: T) {
    this.value = value
  }

  subscribe(listener: (data: T, changed: any[]) => any) {
    this.listeners.add(listener)
  }

  unsubscribe(id: (data: T, changed: any[]) => void): void {
    this.listeners.delete(id)
  }

  get(key?: string): any | T | undefined {
    if (key === undefined) {
      return this.value
    }

    if (typeof this.value === 'object' && this.value !== null) {
      return (this.value as Record<string, T | undefined>)[key]
    }

    return undefined
  }

  set(key: T | string, value: any | null = null): void {
    if (value === null) {
      this.value = key as T
    } else if (typeof this.value === 'object' && this.value !== null) {
      ;(this.value as Record<string, T | null>)[key as string] = value
    } else {
      throw new Error('[error] cannot assign a value to a non-object value')
    }
    this.listeners.forEach(listener => listener(this.value, [value !== null ? key : $reactive.all]))
    return
  }

  getAll(): T {
    return this.value
  }

  static merge(
    reactive1: $reactive<any>,
    reactive2: $reactive<any>,
  ): $reactive<any> {
    const merged = new $reactive<any>({})
    const keys = new Set([
      ...Object.keys(reactive1.getAll()),
      ...Object.keys(reactive2.getAll()),
    ])
    for (const key of keys) {
      const value1 = reactive1.get(key)
      const value2 = reactive2.get(key)
      if (value1 !== undefined && value2 !== undefined) {
        merged.set(key, $reactive.merge(value1, value2))
      } else if (value1 !== undefined) {
        merged.set(key, value1)
      } else if (value2 !== undefined) {
        merged.set(key, value2)
      }
    }
    return merged
  }

  destroy() {
    this.listeners.clear()
    this.value = null as any
  }

  isNull() {
    return this.value === null
  }

  init() {
    this.listeners.clear()
    this.value = {} as any
  }
}
