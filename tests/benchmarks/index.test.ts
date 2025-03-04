import { test, expect, describe, beforeEach, beforeAll } from 'bun:test'
import { Counter } from '../../examples/components/counter'
import { render } from '../../src'

let disable = true
describe('counter benchmark', () => {
  let component: Counter
  beforeEach(() => {
    component = new Counter()
  })
  test('should render in below 5ms', () => {
    const start = performance.now()
    render(component)
    expect(document.body.children[0]).not.toBeNull()
    const end = performance.now()
    console.log(`performance: ${(end - start).toFixed(2)}ms`)
    expect(end - start).toBeLessThan(5)
  })

  test('it should rerender quickly', () => {
    const start = performance.now()
    render(component)
    component.state.set('count', 1)
    const end = performance.now()
    console.log(`performance: ${(end - start).toFixed(2)}ms`)
    expect(end - start).toBeLessThan(5)
  })

  test('it should rerender a large amount quickly', () => {
    let totalTime = 0
    let minTime = Infinity
    let maxTime = -Infinity

    const globalStart = performance.now()
    for (let i = 0; i < 100; i++) {
      const start = performance.now()
      component.state.set('count', i)
      render(component)
      const duration = performance.now() - start

      totalTime += duration
      if (duration < minTime) minTime = duration
      if (duration > maxTime) maxTime = duration
    }
    const globalEnd = performance.now()

    console.log(
      `performance (100 rerenders): ${(globalEnd - globalStart).toFixed(2)}ms`,
    )
    console.log(`longest: ${maxTime.toFixed(2)}ms`)
    console.log(`shortest: ${minTime.toFixed(2)}ms`)
    console.log(`average: ${(totalTime / 100).toFixed(2)}ms`)
  })
})
