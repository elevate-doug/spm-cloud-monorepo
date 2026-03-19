module.exports = {
  extends: ['@steris-spm/eslint-config'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      'babel-module': {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Temporarily disable unresolved import errors for @ aliases
    // since the resolvers are having issues with cross-module paths
    'import/no-unresolved': [
      'error',
      {
        ignore: [
          '^@utils/',
          '^@hooks/',
          '^@constants/',
          '^@database/',
          '^@store/',
        ],
      },
    ],
  },
}
