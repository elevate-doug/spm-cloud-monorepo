module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|react-native-linear-gradient|react-native-image-pan-zoom|@expo/vector-icons|expo-font|expo-.*|react-native-vector-icons)/)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    '^@src/(.*)$': '<rootDir>/../../client/app/$1',
  },
  coverageDirectory: './coverage',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './test-results/unit',
        filename: 'results.html',
        openReport: true,
        includeConsoleLog: true,
        darkTheme: true,
        pageTitle: 'Lingo - Unit Test Results',
        expand: true,
        testCommand: 'jest --config jest.config.js --testMatch=**/*.spec.ts',
      },
    ],
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  globals: {
    __DEV__: true,
  },
}
