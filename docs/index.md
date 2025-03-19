# Introduction
<hr>

## What is Pastel?
Pastel is a simple and easy-to-use way to create frontend applications.
It has builtin SPA support and is built to be lightweight and easy to integrate into existing projects

Here is a simple example:
```javascript
// counter.js
import { Button } from '@pastel-framework/core'

export class Counter extends Button {
  constructor() {
    super()
    this.text = 'You clicked the counter {{count}} times!'

    this.onClick(() => {
      this.state.set('count', (this.state.get('count') ?? 0) + 1)
    })

    this.onRender(() => {
      this.state.set('count', 0)
    })
  }
}
```
In this example, we create a simple counter component that increments a counter when clicked.

The example above makes use of multiple of Pastel's features, such as:
- **State management**: Pastel uses a simple state management system that allows you to easily manage the state of your components.
- **Event handling**: Pastel has a simple event handling system that allows you to easily handle events such as clicks and key presses.
- **Component lifecycle**: Pastel has a simple component lifecycle that allows you to easily handle the creation and destruction of components.

## Why Pastel?
We have designed Pastel to be easy to integrate into existing projects, making it effortless to migrate from vanilla html.
<br>

## API

### Components

Pastel components are classes that extend the `Component` class or any of its subclasses.
For example, the `Button` class is a subclass of the `Component` class.

```javascript
import { Button } from '@pastel-framework/core'

export class MyButton extends Button {
  constructor() {
    super()
    this.text = 'Click me!'
    this.onClick(() => {
      console.log('Button clicked!')
    });
    this.withClassName("my-button");
  }
}
```

Now, you can use the `MyButton` component in your main file:
```javascript
import { Component } from '@pastel-framework/core'
import { MyButton } from './my-button.js'

export default class App extends Component {
  constructor() {
    super();
    
    this.withChildren(
      MyButton
    )
  }
}
```

### State & Templates

Pastel components have a state object that can be used to store data.
The state object is a simple key-value store that can be accessed using the `state` property of the component.
```javascript
import { Button } from '@pastel-framework/core'

export class MyButton extends Button {
  constructor() {
    super()
    this.text = 'You clicked the button {{count}} times!'
    this.onClick(() => {
      console.log('Button clicked!')
      this.state.set('count', (this.state.get('count') ?? 0) + 1)
    });
    this.withClassName("my-button");
  }
}
```
In this example, we create a simple button component that increments a counter when clicked.
The `state` property is used to store the counter value.

<hr>

Up Next:
<div class="up-next-links">
    <a href="/getting-started">Getting Started</a>
    <a href="/examples">Examples</a>
</div>