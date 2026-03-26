import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import webpack from 'webpack'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

const isDev = process.env.NODE_ENV !== 'production'
const apiUrl = process.env.API_BASE_URL || 'http://localhost:5361'

// react-native-web setup
const rnwPath = fs.realpathSync(path.resolve(__dirname, 'node_modules/react-native-web'))
const stubsPath = path.resolve(__dirname, 'src/stubs')
const monorepoRoot = path.resolve(__dirname, '../..')

export default {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js', '.jsx'],
    alias: {
      'react-native$': path.join(rnwPath, 'dist/index.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults', modules: false }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: isDev ? [require.resolve('react-refresh/babel')] : [],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Transpile lingo package source (TypeScript/TSX)
      {
        test: /\.[jt]sx?$/,
        include: [
          path.join(monorepoRoot, 'packages'),
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
      },
      // Stub unresolvable imports in lingo source files
      {
        test: /\.tsx?$/,
        include: /packages\/lingo/,
        enforce: 'pre',
        use: [{
          loader: path.resolve(__dirname, 'stub-lingo-loader.cjs'),
        }],
      },
      // Handle JSX in react-native-paper and react-native-vector-icons
      {
        test: /\.js$/,
        include: /node_modules\/(react-native-vector-icons|react-native-paper)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-flow'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    // Stub native-only packages for react-native-web compatibility
    new webpack.NormalModuleReplacementPlugin(/^react-native-vector-icons(\/.*)?$/, path.join(stubsPath, 'react-native-vector-icons.ts')),
    new webpack.NormalModuleReplacementPlugin(/^react-native-safe-area-context(\/.*)?$/, path.join(stubsPath, 'react-native-safe-area-context.ts')),
    new webpack.NormalModuleReplacementPlugin(/^react-native-image-pan-zoom$/, path.join(stubsPath, 'empty.ts')),
    new webpack.NormalModuleReplacementPlugin(/^react-native-svg(\/.*)?$/, path.join(stubsPath, 'empty.ts')),
    new webpack.NormalModuleReplacementPlugin(/@react-native-community\/.*/, path.join(stubsPath, 'empty.ts')),
    new webpack.NormalModuleReplacementPlugin(/react-native\/Libraries\//, path.join(stubsPath, 'empty.ts')),
    new webpack.NormalModuleReplacementPlugin(/^@react-native-vector-icons\/.*/, path.join(stubsPath, 'react-native-vector-icons.ts')),
    new webpack.NormalModuleReplacementPlugin(/^@expo\/vector-icons\/.*/, path.join(stubsPath, 'react-native-vector-icons.ts')),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || ''),
    }),
    ...(isDev ? [new ReactRefreshWebpackPlugin()] : []),
    ...(!isDev ? [new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    })] : []),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: { ignore: ['**/index.html'] },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 5173,
    proxy: [
      {
        context: ['/api'],
        target: apiUrl,
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/ws'],
        target: apiUrl,
        ws: true,
        changeOrigin: true,
      },
    ],
  },
  ignoreWarnings: [
    { message: /export .* was not found in/ },
    { message: /Critical dependency/ },
    { module: /react-native-web/ },
    { module: /react-native-paper/ },
  ],
  devtool: isDev ? 'eval-source-map' : 'source-map',
}
