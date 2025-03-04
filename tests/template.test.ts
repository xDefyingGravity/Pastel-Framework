import { render_template } from '../src/templates/template'
import { describe, it, expect } from 'bun:test'

describe('render_template', () => {
  it('should replace single variable placeholder', () => {
    const template = 'Hello {{name}}!'
    const params = { name: 'World' }
    expect(render_template(template, params)).toBe('Hello World!')
  })

  it('should handle nested object properties', () => {
    const template = 'Welcome {{user.profile.name}}!'
    const params = {
      user: {
        profile: {
          name: 'John',
        },
      },
    }
    expect(render_template(template, params)).toBe('Welcome John!')
  })

  it('should handle multiple placeholders', () => {
    const template = '{{greeting}} {{name}}, age {{age}}'
    const params = {
      greeting: 'Hi',
      name: 'Alice',
      age: 25,
    }
    expect(render_template(template, params)).toBe('Hi Alice, age 25')
  })

  it('should return empty string for undefined nested properties', () => {
    const template = 'Value: {{data.missing.property}}'
    const params = {
      data: {},
    }
    expect(render_template(template, params)).toBe('Value: ')
  })

  it('should handle non-string values', () => {
    const template = 'Number: {{count}}, Boolean: {{isActive}}'
    const params = {
      count: 42,
      isActive: true,
    }
    expect(render_template(template, params)).toBe('Number: 42, Boolean: true')
  })

  it('should handle empty parameters object', () => {
    const template = 'Hello {{name}}!'
    const params = {}
    expect(render_template(template, params)).toBe('Hello !')
  })

  it('should preserve text without placeholders', () => {
    const template = 'Plain text without variables'
    const params = { unused: 'value' }
    expect(render_template(template, params)).toBe(
      'Plain text without variables',
    )
  })

  it('should handle whitespace in placeholder expressions', () => {
    const template = 'Hello {{  name  }}!'
    const params = { name: 'World' }
    expect(render_template(template, params)).toBe('Hello World!')
  })
})
