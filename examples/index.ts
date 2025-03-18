import {
  Div,
  Input,
  Paragraph,
  Head,
  Router,
  RouterLink,
  Pipeline,
} from '../src'
import { Counter } from './components/counter'

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

const input = new Input()
  .withId('input')
  .withPlaceholder('Enter your name')
  .onInput((event: Event) => {
    const input = event.target as HTMLInputElement
    app.state.set('name', input.value)
  })
  .withClassNames('text-gray-900', 'font-bold', 'mb-8')
const app = new Div()
  .withClassNames(
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'h-screen',
    'bg-gray-100',
  )
  .withChildren(
    new Paragraph()
      .withId('app')
      .withText(
        "Hello, {{name ? name : 'Unset'}}! Welcome with pastel version {{pastel_version}}!",
      )
      .withClassNames(
        'text-gray-900',
        'font-bold',
        'text-3xl',
        'text-center',
        'p-4',
      ),
    input,
    new Counter(),
    new RouterLink('/about')
      .withText('About')
      .withClassNames('text-blue-500', 'mt-4'),
  )

const about = new Div()
  .withClassNames(
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'h-screen',
    'bg-gray-100',
  )
  .withChildren(
    new Paragraph().withId('about').withText('About my page'),
    new RouterLink('/')
      .withText('Home')
      .withClassNames('text-blue-500', 'mt-4'),
  )

app.state.set('math', (x: number, y: number) => {
  return x + y
})
app.onRender(() => {
  app.state.set('name', 'Unset')
})

app.onDestroy(() => {
  // recommended to destroy state when component is destroyed, unless you are halting the destroy process
  app.state.destroy()

  return false;
})

const head = new Head('My Awesome app')

const router = new Router(
  {
    '/': app,
    '/about': about,
  },
  head,
)

pipeline.mount()
router.listen()
