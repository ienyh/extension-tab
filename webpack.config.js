const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const WebpackBarPlugin = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const mode = process.env.NODE_ENV
const isDev = mode === 'development'
const devDirectory = 'dist'
const plugins = [
  new HtmlWebpackPlugin({
    filename: 'popup.html',
    template: './src/popup/template.html',
    chunks: ['popup'],
  }),
  new HtmlWebpackPlugin({
    filename: 'newtab.html',
    template: './src/newtab/template.html',
    chunks: ['newtab'],
  }),
  new MiniCssExtractPlugin(),
  new CopyWebpackPlugin({
    patterns: [{ from: './assets', to: '.' }],
  }),
  new WebpackBarPlugin(),
  new FriendlyErrorsWebpackPlugin(),
  new webpack.ProgressPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.BASENAME': JSON.stringify(process.env.BASENAME),
  }),
]
if (isDev) {
  plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  plugins.push(new CssMinimizerPlugin())
  plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
}

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode,
  devtool: isDev ? 'source-map' : false,
  entry: {
    popup: './src/popup/index.tsx',
    newtab: './src/newtab/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, isDev ? devDirectory : 'build'),
    clean: true,
    filename: '[name].js',
  },
  stats: 'summary',
  devServer: {
    hot: true,
    static: [{ directory: path.resolve(__dirname, devDirectory) }],
    devMiddleware: {
      writeToDisk: (filePath) => {
        return !/\.hot-update\.(js|json)/.test(filePath)
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@src/utils': path.resolve(__dirname, 'src/utils/'),
      '@src/common': path.resolve(__dirname, 'src/common/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        include: /node_modules\/redux-logger/,
        // redux-logger do not set sideEffects to false, manually set sideEffects to false
        sideEffects: false,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          enforce: true,
          priority: 20,
        },
        rxjs: {
          test: /[\\/]node_modules[\\/](rxjs)[\\/]/,
          name: 'rxjs',
          chunks: 'all',
          enforce: true,
          priority: 10,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins,
}
