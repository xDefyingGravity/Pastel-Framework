class c {
  value
  listeners = new Set()
  constructor(t) {
    this.value = t
    this.value = t
  }
  subscribe(t) {
    this.listeners.add(t)
  }
  unsubscribe(t) {
    this.listeners.delete(t)
  }
  get(t) {
    if (t === void 0) return this.value
    if (typeof this.value === 'object' && this.value !== null)
      return this.value[t]
    return
  }
  set(t, e = null) {
    if (e === null) this.value = t
    else if (typeof this.value === 'object' && this.value !== null)
      this.value[t] = e
    else throw new Error('[error] cannot assign a value to a non-object value')
    this.listeners.forEach(n => n(this.value))
    return
  }
  getAll() {
    return this.value
  }
  static merge(t, e) {
    let n = new c({}),
      o = new Set([...Object.keys(t.getAll()), ...Object.keys(e.getAll())])
    for (let s of o) {
      let r = t.get(s),
        i = e.get(s)
      if (r !== void 0 && i !== void 0) n.set(s, c.merge(r, i))
      else if (r !== void 0) n.set(s, r)
      else if (i !== void 0) n.set(s, i)
    }
    return n
  }
  destroy() {
    this.listeners.clear(), (this.value = null)
  }
  isNull() {
    return this.value === null
  }
  init() {
    this.listeners.clear(), (this.value = {})
  }
}
class a {
  static counter = 0
  id = `c-${a.counter++}`
  tagName = 'div'
  className = ''
  children = []
  attributes = {}
  state = new c({})
  events = {}
  text = ''
  parent = null
  onRenderFunctions = []
  onUpdateFunctions = []
  onDestroyFunctions = []
  constructor(t = {}) {
    for (let e in t) this.state.set(e, t[e])
  }
  onRender(t) {
    return this.onRenderFunctions.push(t), this
  }
  onUpdate(t) {
    return this.onUpdateFunctions.push(t), this
  }
  onDestroy(t) {
    return this.onDestroyFunctions.push(t), this
  }
  withId(t) {
    return (this.id = t), this
  }
  withClassName(t) {
    return (this.className = this.className + ' ' + t), this
  }
  withChild(t) {
    return (t.parent = this), this.children.push(t), this
  }
  withChildren(...t) {
    for (let e of t) this.withChild(e)
    return this
  }
  withClassNames(...t) {
    return t.map(this.withClassName.bind(this)), this
  }
  withAttribute(t, e) {
    return (this.attributes[t] = e), this
  }
  withAttributes(t) {
    return Object.keys(t).map(e => this.withAttribute(e, t[e])), this
  }
  on(t, e) {
    if (!this.events[t]) this.events[t] = e
    else {
      let n = this.events[t]
      this.events[t] = o => {
        n(o), e(o)
      }
    }
    return this
  }
  onClick(t) {
    return this.on('click', t), this
  }
  onEnter(t) {
    return this.on('mouseenter', t), this
  }
  onLeave(t) {
    return this.on('mouseleave', t), this
  }
  onFocus(t) {
    return this.on('focus', t), this
  }
  as(t) {
    return (this.tagName = t), this
  }
  onBlur(t) {
    return this.on('blur', t), this
  }
  onDoubleClick(t) {
    return this.on('dblclick', t), this
  }
  onMouseDown(t) {
    return this.on('mousedown', t), this
  }
  onMouseUp(t) {
    return this.on('mouseup', t), this
  }
  onMouseMove(t) {
    return this.on('mousemove', t), this
  }
  withText(t) {
    return (this.text = t), this
  }
}
var w = new Map()
function v(t, e) {
  if (t === e) return
  if (t.tagName !== e.tagName) {
    t.replaceWith(e)
    return
  }
  let n = t.attributes,
    o = e.attributes
  for (let i = 0; i < o.length; i++) w.set(o[i].name, o[i].value)
  for (let i = n.length - 1; i >= 0; i--) {
    let l = n[i].name
    if (!w.has(l)) t.removeAttribute(l)
  }
  for (let i = 0; i < o.length; i++) {
    let l = o[i].name
    if (t.getAttribute(l) !== o[i].value) t.setAttribute(l, o[i].value)
  }
  let s = [...t.childNodes],
    r = [...e.childNodes]
  for (let i = 0; i < r.length || i < s.length; i++)
    if (!r[i]) t.removeChild(s[i])
    else if (!s[i]) t.appendChild(r[i].cloneNode(!0))
    else if (
      s[i].nodeType === Node.TEXT_NODE &&
      r[i].nodeType === Node.TEXT_NODE
    ) {
      if (s[i].textContent !== r[i].textContent)
        s[i].textContent = r[i].textContent
    } else if (s[i].nodeName !== r[i].nodeName)
      t.replaceChild(r[i].cloneNode(!0), s[i])
    else v(s[i], r[i])
}
import { Parser as A } from 'expr-eval'
var x = '0.0.1'
var N = /{{(.*?)}}/g,
  L = new A(),
  k = { pastel_version: x }
function p(t, e) {
  let n = { ...e, ...k }
  return t.replace(N, (o, s) => {
    try {
      let r = L.parse(s).evaluate(n)
      return String(r)
    } catch (r) {
      return ''
    }
  })
}
var h = !1
function O(t) {
  let e,
    n = new c({})
  e = t
  while (e) (n = c.merge(n, e.state)), (e = e.parent)
  return n
}
function y(t, e = !1) {
  let {
      tagName: n,
      className: o,
      attributes: s,
      children: r,
      events: i,
      text: l,
    } = t,
    m = O(t),
    u = document.createElement(n)
  for (let [d, g] of Object.entries(s))
    u.setAttribute(d, p(g.toString(), m.getAll()))
  if (((u.className = p(o, m.getAll())), l)) u.textContent = l
  u.innerText = p(u.innerText, m.getAll())
  for (let d of r) u.appendChild(y(d, e))
  for (let [d, g] of Object.entries(i)) u.addEventListener(d, g)
  if (e && t.state)
    t.state.subscribe(() => {
      if (h) return
      ;(h = !0), v(u, y(t)), C(t), (h = !1)
    })
  return (u.id = t.id), u
}
function E(t) {
  for (let e of t.onRenderFunctions) {
    if (typeof e !== 'function') {
      console.warn('[pastel] onRender function is not a function')
      continue
    }
    e()
  }
  for (let e of t.children) E(e)
}
function f(t) {
  let e = null
  for (let n of t.onDestroyFunctions) {
    if (typeof n !== 'function') {
      console.warn('[pastel] onDestroy function is not a function')
      continue
    }
    e = n() ?? !1
  }
  for (let n of t.children) f(n)
  return e
}
function C(t) {
  if (t.onUpdateFunctions.length > 50 && !window.PASTEL_NO_PERFORMANCE_WARN)
    console.warn(`[pastel] you have more than 50 onUpdate functions, this is not recommended for performance reasons
you can disable this warning by setting window.PASTEL_NO_WARN to true`)
  for (let e of t.onUpdateFunctions) {
    if (typeof e !== 'function') {
      console.warn('[pastel] onUpdate function is not a function')
      continue
    }
    e()
  }
  for (let e of t.children) C(e)
}
function b(t, e = !1) {
  if (h) return
  if (((h = !0), t.state.isNull())) t.state.init()
  E(t)
  let n = y(t, !0)
  if (
    (window.addEventListener('beforeunload', () => {
      f(t)
    }),
    e)
  )
    document.body.innerHTML = ''
  document.body.appendChild(n), (h = !1)
}
class S extends a {
  constructor(t = {}) {
    super(t)
    this.as('button')
  }
}
class H extends a {
  constructor(t, e = {}) {
    super(e)
    if (t < 1 || t > 6) throw new Error('Header level must be between 1 and 6')
    this.as('h' + t)
  }
}
class M extends a {
  constructor(t = {}) {
    super(t)
    this.as('p')
  }
}
class I extends a {
  constructor(t, e = {}) {
    super(e)
    this.text = t
  }
}
class P extends a {
  constructor(t = {}) {
    super(t)
    this.as('div')
  }
}
class T extends a {
  constructor(t = '', e = {}) {
    super(e)
    if ((this.as('a'), t)) this.attributes.href = t
  }
  withLink(t) {
    return (this.attributes.href = t), this
  }
  withBlankTarget() {
    return (this.attributes.target = '_blank'), this
  }
  withRel(t) {
    return (this.attributes.rel = t), this
  }
}
class F extends T {
  constructor(t = '', e = {}) {
    super('#' + t, e)
  }
  withLink(t) {
    return (this.attributes.href = '#' + t), this
  }
}
class U extends a {
  constructor(t, e = {}) {
    super(e)
    this.as('img'), (this.attributes.src = t)
  }
  withAlt(t) {
    return (this.attributes.alt = t), this
  }
  withWidth(t) {
    return (this.attributes.width = t.toString()), this
  }
  withHeight(t) {
    return (this.attributes.height = t.toString()), this
  }
}
class j extends a {
  constructor(t = 'text', e = {}) {
    super()
    this.as('input'), (this.attributes.type = t)
  }
  withValue(t) {
    return (this.attributes.value = t), this
  }
  withPlaceholder(t) {
    return (this.attributes.placeholder = t), this
  }
  withRequired() {
    return (this.attributes.required = !0), this
  }
  withDisabled() {
    return (this.attributes.disabled = !0), this
  }
  withReadOnly() {
    return (this.attributes.readOnly = !0), this
  }
  withAutofocus() {
    return (this.attributes.autofocus = !0), this
  }
  withMin(t) {
    return (this.attributes.min = t.toString()), this
  }
  withMax(t) {
    return (this.attributes.max = t.toString()), this
  }
  onInput(t) {
    return this.on('input', t), this
  }
}
class _ {
  title
  links = []
  meta_tags = []
  scripts = []
  styles = []
  constructor(t) {
    this.title = t
  }
  addLink(t, e, n = {}) {
    this.links.push({ type: t, href: e, data: n })
  }
  addMeta(t, e) {
    this.meta_tags.push({ name: t, content: e })
  }
  addScript(t, e = !1) {
    this.scripts.push({ src: t, async: e })
  }
  addStyle(t) {
    this.styles.push(t)
  }
  withLink(t, e) {
    return this.links.push({ type: t, href: e, data: {} }), this
  }
  withMeta(t, e) {
    return this.meta_tags.push({ name: t, content: e }), this
  }
  withScript(t, e = !1) {
    return this.scripts.push({ src: t, async: e }), this
  }
  withStyle(t) {
    return this.styles.push(t), this
  }
  render() {
    if (!this.meta_tags.some(e => e.name === 'viewport'))
      this.addMeta('viewport', 'width=device-width, initial-scale=1.0')
    if (!this.meta_tags.some(e => e.name === 'charset'))
      this.addMeta('charset', 'utf-8')
    let t = document.getElementsByTagName('title')[0]
    if (!t) (t = document.createElement('title')), document.head.appendChild(t)
    t.textContent = this.title
    for (let e of this.meta_tags) {
      let n = document.createElement('meta')
      n.setAttribute('name', e.name),
        n.setAttribute('content', e.content),
        document.head.appendChild(n)
    }
    for (let e of this.links) {
      let n = document.createElement('link')
      if (
        (n.setAttribute('rel', e.type), n.setAttribute('href', e.href), e.data)
      )
        n.innerHTML = this.render_link_data(e.data)
      document.head.appendChild(n)
    }
    for (let e of this.scripts) {
      let n = document.createElement('script')
      if ((n.setAttribute('src', e.src), e.async)) n.setAttribute('async', '')
      document.head.appendChild(n)
    }
    for (let e of this.styles) {
      let n = document.createElement('style')
      ;(n.textContent = e), document.head.appendChild(n)
    }
  }
  render_link_data(t) {
    return Object.entries(t)
      .map(([e, n]) => `${e}="${n}"`)
      .join(' ')
  }
}
function R(t, e = new _('Pastel App')) {
  e.render(), b(t)
}
class D {
  routes = {}
  current_route
  current_hash = window.location.hash
  head
  did_halt_destroy = !1
  parse_hash(t) {
    return t.split('#')[1] ?? null
  }
  constructor(t, e) {
    let n = this.parse_hash(window.location.hash) ?? '/'
    ;(this.routes = t),
      (this.head = e),
      (this.current_route =
        this.routes[n] || this.routes['/'] || this.routes['/default'])
  }
  listen() {
    window.addEventListener('hashchange', t => {
      this.handle_hashchange(
        window.location.hash,
        this.parse_hash(t.oldURL) || '/',
      )
    }),
      R(this.current_route, this.head)
  }
  navigate(t) {
    window.location.hash = t
  }
  handle_hashchange(t, e) {
    if (this.did_halt_destroy) {
      this.did_halt_destroy = !1
      return
    }
    let n = this.parse_hash(t),
      o = this.current_route
    if (f(o) === !0 && !window.PASTEL_NO_ROUTE_HALT) {
      if (!window.PASTEL_NO_ROUTE_HALT_WARN)
        console.warn(`we attempted to destroy ${e}, but it halted the process of rendering the next route.
to disable this, set window.PASTEL_NO_ROUTE_HALT to true,
or, to just disable the warning, set window.PASTEL_NO_ROUTE_HALT_WARN to true`)
      ;(window.location.hash = e), (this.did_halt_destroy = !0)
      return
    }
    if (n === null || !this.routes[n])
      this.current_route =
        this.routes['/404'] ||
        this.routes['/'] ||
        this.routes['/default'] ||
        this.routes['/']
    else this.current_route = this.routes[n]
    b(this.current_route, !0)
  }
}
export {
  p as render_template,
  R as render,
  v as apply_diffs,
  I as Text,
  F as RouterLink,
  D as Router,
  M as Paragraph,
  x as PASTEL_VERSION,
  T as Link,
  j as Input,
  U as Image,
  H as Header,
  _ as Head,
  P as Div,
  a as Component,
  S as Button,
  c as $reactive,
}

//# debugId=A3F9E19D9DA4BF8B64756E2164756E21
