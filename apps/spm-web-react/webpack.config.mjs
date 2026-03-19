import path from 'path'
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

export default {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
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
  devtool: isDev ? 'eval-source-map' : 'source-map',
}
