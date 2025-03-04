import { Parser } from 'expr-eval'
import { PASTEL_VERSION } from '../constants'

const regex = /{{(.*?)}}/g
const parser = new Parser()

const defaultParams = {
  pastel_version: PASTEL_VERSION,
}

export function render_template(
  string: string,
  params: { [key: string]: any },
): string {
  const allParams = { ...params, ...defaultParams }

  return string.replace(regex, (_, p1) => {
    try {
      const value = parser.parse(p1).evaluate(allParams as any)
      return String(value)
    } catch (error) {
      return ''
    }
  })
}
