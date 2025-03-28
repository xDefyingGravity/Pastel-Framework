import { Button, $window } from '../../src'

export class Counter extends Button {
  constructor() {
    super()
    this.text = 'You clicked the counter {{count}} times!'

    this.onClick(() => {
      this.state.set('count', (this.state.get('count') ?? 0) + 1)
      $window.set('title', `You clicked the counter ${this.state.get('count')} times!`)
    })

    this.withClassNames(
      'p-2',
      'bg-blue-500',
      'text-white',
      'rounded',
      'shadow',
      'hover:bg-blue-600',
    )

    this.onRender(() => {
      this.state.set('count', 0)
      $window.set('title', 'You clicked the counter 0 times!')
    })
  }
}
