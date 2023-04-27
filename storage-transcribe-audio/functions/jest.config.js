const packageJson = require('./package.json');

module.exports = {
  name: packageJson.name,
  displayName: packageJson.name,
  rootDir: './',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/__tests__/tsconfig.json',
    },
  },
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/__tests__/jest.setup.ts'],
  testMatch: ['**/__tests__/*.test.ts'],
  moduleNameMapper: {
    'firebase-admin/eventarc':
      '<rootDir>/node_modules/firebase-admin/lib/eventarc',
    'firebase-functions/encoder':
      '<rootDir>/node_modules/firebase-functions/lib/encoder',
  },
};
