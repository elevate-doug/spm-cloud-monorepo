export default {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['./src/__tests__/setup.ts'],
  testMatch: ['<rootDir>/src/__tests__/**/*.{test,spec}.{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': '<rootDir>/src/__tests__/mocks/styleMock.ts',
    '\\.(png|jpg|jpeg|gif|svg|ico|webp)$': '<rootDir>/src/__tests__/mocks/fileMock.ts',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/__tests__/**'],
}
