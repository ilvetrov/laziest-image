/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  transform: {
    '.(ts|tsx)': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ESNext',
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jsdom',
}

module.exports = config
