import typescript from '@rollup/plugin-typescript'
import cleanup from 'rollup-plugin-cleanup'
import pkg from './package.json'

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.exports['.'].import,
        format: 'es',
        exports: 'named',
      },
    ],
    plugins: [typescript({ exclude: ['**.test.ts', '**.test.tsx', 'src/sizes/**'] }), cleanup()],
    external: ['react', 'react-dom', 'pure-handlers', 'pure-handlers/react'],
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
    external: ['react', 'react-dom', 'pure-handlers', 'pure-handlers/react'],
  },
]

export default config
