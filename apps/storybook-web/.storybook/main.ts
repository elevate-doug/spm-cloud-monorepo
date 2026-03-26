import type { StorybookConfig } from '@storybook/react-webpack5'
import path from 'path'
import fs from 'fs'
import webpack from 'webpack'

const rnwPath = fs.realpathSync(path.resolve(__dirname, '../node_modules/react-native-web'))
const stubsPath = path.resolve(__dirname, '../src/stubs')

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    if (!config.resolve) config.resolve = {}

    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': path.join(rnwPath, 'dist/index.js'),
    }

    config.resolve.extensions = ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js']

    // Use NormalModuleReplacementPlugin for regex-based stubbing of native-only packages
    const vectorIconsStub = path.join(stubsPath, 'react-native-vector-icons.ts')
    const safeAreaStub = path.join(stubsPath, 'react-native-safe-area-context.ts')
    const emptyStub = path.join(stubsPath, 'empty.ts')

    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^react-native-vector-icons(\/.*)?$/, vectorIconsStub),
      new webpack.NormalModuleReplacementPlugin(/^react-native-safe-area-context(\/.*)?$/, safeAreaStub),
      new webpack.NormalModuleReplacementPlugin(/^react-native-image-pan-zoom$/, emptyStub),
      new webpack.NormalModuleReplacementPlugin(/^react-native-svg(\/.*)?$/, emptyStub),
      new webpack.NormalModuleReplacementPlugin(/@react-native-community\/.*/, emptyStub),
      new webpack.NormalModuleReplacementPlugin(/react-native\/Libraries\//, emptyStub),
      new webpack.NormalModuleReplacementPlugin(/^@react-native-vector-icons\/.*/, vectorIconsStub),
      new webpack.NormalModuleReplacementPlugin(/^@expo\/vector-icons\/.*/, vectorIconsStub),
    )

    // Transpile TypeScript/TSX from our monorepo packages (lingo, stories, stubs)
    const monorepoRoot = path.resolve(__dirname, '../../..')
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push({
      test: /\.[jt]sx?$/,
      include: [
        path.join(monorepoRoot, 'packages'),
        path.join(monorepoRoot, 'apps/storybook-web/src'),
        path.join(monorepoRoot, 'apps/storybook-web/.storybook'),
        path.join(monorepoRoot, 'apps/spm-web-react/src'),
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ],
        },
      },
    })

    // Handle JSX in .js files from react-native-vector-icons and similar
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/(react-native-vector-icons|react-native-paper)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-flow'],
        },
      },
    })

    // Custom loader to stub unresolvable imports in lingo source files
    config.module.rules.push({
      test: /\.tsx?$/,
      include: /packages\/lingo/,
      enforce: 'pre' as const,
      use: [{
        loader: path.join(__dirname, 'stub-lingo-loader.cjs'),
      }],
    })

    // Suppress warnings from react-native-web using deprecated React 18 APIs with React 19
    config.ignoreWarnings = [
      { message: /export .* was not found in/ },
      { message: /Critical dependency/ },
      { module: /react-native-web/ },
      { module: /react-native-paper/ },
    ]

    return config
  },
}

export default config
