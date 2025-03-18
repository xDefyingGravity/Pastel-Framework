await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  format: 'esm',
  external: ['expr-eval', 'node:path'],
  minify: true,
  sourcemap: 'external',
  target: 'browser',
})
