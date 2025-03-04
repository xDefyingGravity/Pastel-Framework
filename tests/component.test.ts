import { Component } from '../src/component/component'
import { describe, it, expect, beforeEach } from 'bun:test'

describe('Component.withId', () => {
  let component: Component

  beforeEach(() => {
    component = new Component()
  })

  it('should set the id property', () => {
    const result = component.withId('test-id')
    expect(component.id).toBe('test-id')
  })

  it('should return the component instance for chaining', () => {
    const result = component.withId('test-id')
    expect(result).toBe(component)
  })

  it('should override existing id', () => {
    component.withId('first-id')
    const result = component.withId('second-id')
    expect(component.id).toBe('second-id')
  })

  it('should handle empty string id', () => {
    const result = component.withId('')
    expect(component.id).toBe('')
  })
})
