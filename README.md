# Pastel

## A simple way to create frontend SPA's in native JavaScript

### Features

- Simple and easy to use
- Barely any dependencies (only one!)
- No need to use a bundler, you can just include the script in your HTML
- Integrates with vite (coming soon)
- Builtin SPA router
- Easy state management
- Full control over the head tag, and rendering of the components
- Unique Pipeline system for applying transformations to components
### Installation

```bash
npm i pastel
```

### Pipelines
Pipelines are a powerful way to transform all components, with support for whitelists, blacklists, and ignored components.
```javascript
import { Pipeline } from 'pastel';
const pipeline = new Pipeline([
  {
    modifier: 'attributes',
    function: (attributes: any) => {
      attributes['class'] = 'text-6xl'
      return attributes
    },
    whitelist: [
      "p"
    ]
  },
  {
    modifier: 'text',
    function: (text: string) => {
      return text.replace('Hello', 'Hi')
    },
  },
  {
    modifier: 'style',
    function: (style: any) => {
      style['font-size'] = '2rem!important'
      return style
    },
    whitelist: [
      'input'
    ]
  }
])
pipeline.mount();

// You can also unmount like this: pipeline.unmount()
```
And that's it!
All you have to do is call pipeline.mount() and it will be applied to any renders/re-renders
### Example

```javascript
import { Div, Paragraph, Router, Head } from 'pastel'

const app = new Div().withChildren(new Paragraph().withText('Hello World!'))

const head = new Head().withTitle('Hello World!')

const router = new Router(
  {
    '/': app,
  },
  head,
)
router.listen()
```


_\*Pastel is still under development and is not yet ready for production use._
