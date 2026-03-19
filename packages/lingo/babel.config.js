module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@utils': '../../client/app/utils',
            '@hooks': '../../client/app/hooks',
            '@constants': '../../client/app/constants',
            '@database': '../../client/app/database',
            '@store': '../../client/app/store',
            // Web-compatible shim for react-native-linear-gradient
            'react-native-linear-gradient':
              '../../client/app/utils/web-icons/LinearGradientWrapper',
          },
        },
      ],
    ],
  }
}
