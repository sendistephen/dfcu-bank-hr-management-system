const { resolve } = require('path');
const root = resolve(__dirname); // Points to the backend folder

module.exports = {
  preset: 'ts-jest', // Use ts-jest for TypeScript support
  testEnvironment: 'node', // Use Node.js environment
  rootDir: root, // Set the root directory to backend
  testMatch: [
    '**/*.unit.test.ts', // For unit tests
    '**/*.integration.test.ts', // For integration tests
    '**/*.e2e.test.ts', // For end-to-end tests
  ], // Correct path to tests folder inside backend
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust alias mapping relative to backend/src
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'], // Correct path to setup file in backend
};
