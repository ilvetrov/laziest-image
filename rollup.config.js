import typescript from '@rollup/plugin-typescript'
import cleanup from 'rollup-plugin-cleanup'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.exports['.'].import,
        format: 'es',
        exports: 'named',
      },
    ],
    plugins: [typescript({ exclude: ['**.test.ts', '**.test.tsx'] }), cleanup()],
    external: ['react', 'react-dom', 'pure-handlers'],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.exports['.'].require,
        format: 'cjs',
        exports: 'named',
      },
    ],
    plugins: [typescript({ declaration: false }), cleanup()],
    external: ['react', 'react-dom', 'pure-handlers'],
  },
]
