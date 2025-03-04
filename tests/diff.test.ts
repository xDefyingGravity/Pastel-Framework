import { apply_diffs } from '../src/diff'
import { describe, it, expect, beforeEach, beforeAll } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'

beforeAll(() => {
  GlobalRegistrator.register()
})

describe('apply_diffs', () => {
  let element1: HTMLElement
  let newElement: HTMLElement

  beforeEach(() => {
    element1 = document.createElement('div')
    newElement = document.createElement('div')
  })

  it('should update attributes when values differ', () => {
    element1.setAttribute('class', 'old-class')
    newElement.setAttribute('class', 'new-class')

    apply_diffs(element1, newElement)

    expect(element1.getAttribute('class')).toBe('new-class')
  })

  it('should remove attributes not present in new element', () => {
    element1.setAttribute('data-test', 'value')
    element1.setAttribute('class', 'keep')
    newElement.setAttribute('class', 'keep')

    apply_diffs(element1, newElement)

    expect(element1.hasAttribute('data-test')).toBe(false)
    expect(element1.getAttribute('class')).toBe('keep')
  })

  it('should add new attributes from new element', () => {
    newElement.setAttribute('data-new', 'value')

    apply_diffs(element1, newElement)

    expect(element1.getAttribute('data-new')).toBe('value')
  })

  it('should handle nested elements correctly', () => {
    element1.innerHTML = '<div class="child">Old text</div>'
    newElement.innerHTML = '<div class="updated">New text</div>'

    apply_diffs(element1, newElement)

    expect(element1.innerHTML).toBe('<div class="updated">New text</div>')
  })

  it('should remove extra children from first element', () => {
    element1.innerHTML = '<div>1</div><div>2</div><div>3</div>'
    newElement.innerHTML = '<div>1</div>'

    apply_diffs(element1, newElement)

    expect(element1.children.length).toBe(1)
    expect(element1.innerHTML).toBe('<div>1</div>')
  })

  it('should add missing children from new element', () => {
    element1.innerHTML = '<div>1</div>'
    newElement.innerHTML = '<div>1</div><div>2</div><div>3</div>'

    apply_diffs(element1, newElement)

    expect(element1.children.length).toBe(3)
    expect(element1.innerHTML).toBe('<div>1</div><div>2</div><div>3</div>')
  })

  it('should update text content when different', () => {
    element1.textContent = 'old text'
    newElement.textContent = 'new text'

    apply_diffs(element1, newElement)

    expect(element1.textContent).toBe('new text')
  })

  it('should handle empty text content', () => {
    element1.textContent = 'some text'
    newElement.textContent = ''

    apply_diffs(element1, newElement)

    expect(element1.textContent).toBe('')
  })
})
