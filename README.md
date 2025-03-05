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

### Installation

```bash
npm i pastel
```

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
