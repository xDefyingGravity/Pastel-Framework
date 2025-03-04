import { $reactive } from '../src/state'
import { describe, it, expect, jest, beforeEach } from 'bun:test'

describe('Reactive unsubscribe', () => {
  let reactive: $reactive<number>
  let listener1: jest.Mock
  let listener2: jest.Mock

  beforeEach(() => {
    reactive = new $reactive<number>(0)
    listener1 = jest.fn()
    listener2 = jest.fn()
  })

  it('should remove listener from subscribers list', () => {
    reactive.subscribe(listener1)
    reactive.subscribe(listener2)
    reactive.unsubscribe(listener1)

    reactive.set(42)

    expect(listener1).not.toHaveBeenCalled()
    expect(listener2).toHaveBeenCalledWith(42)
  })

  it('should handle unsubscribing non-existent listener', () => {
    const nonExistentListener = jest.fn()
    reactive.unsubscribe(nonExistentListener)

    reactive.set(42)

    expect(nonExistentListener).not.toHaveBeenCalled()
  })

  it('should handle multiple unsubscribe calls for same listener', () => {
    reactive.subscribe(listener1)
    reactive.unsubscribe(listener1)
    reactive.unsubscribe(listener1)

    reactive.set(42)

    expect(listener1).not.toHaveBeenCalled()
  })

  it('should maintain other listeners when unsubscribing one', () => {
    const listener3 = jest.fn()
    reactive.subscribe(listener1)
    reactive.subscribe(listener2)
    reactive.subscribe(listener3)

    reactive.unsubscribe(listener2)
    reactive.set(100)

    expect(listener1).toHaveBeenCalledWith(100)
    expect(listener2).not.toHaveBeenCalled()
    expect(listener3).toHaveBeenCalledWith(100)
  })
})
