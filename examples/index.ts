import { Div, Input, Paragraph, Head, Router, RouterLink } from '../src'
import { Counter } from './components/counter'
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
    new Input()
      .withId('input')
      .withPlaceholder('Enter your name')
      .onInput((event: Event) => {
        const input = event.target as HTMLInputElement
        app.state.set('name', input.value)
      })
      .withClassNames('text-gray-900', 'font-bold', 'mb-8'),
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

  return false
})

const head = new Head('My Awesome app')

const router = new Router(
  {
    '/': app,
    '/about': about,
  },
  head,
)

router.listen()
