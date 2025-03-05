import dts from 'bun-plugin-dts'

// @ts-ignore
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  format: 'esm',
  external: ['expr-eval', 'node:path', 'bun-plugin-dts'],
  minify: true,
  sourcemap: 'external',
  target: 'browser',
  plugins: [dts()],
})
