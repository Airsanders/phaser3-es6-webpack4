const webpack = require('webpack')
const merge = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')

let baseConfig = require('./webpack.base.config')

let devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    'vendors': ['phaser']
  },
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Phaser3 DEMO',
      filename: 'index.html',
      meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'},
      template: './src/index.html',
      chunks: ['vendors', 'app'],
    })
  ],
  devServer: {
    host:'localhost',
    port: 9000,
    proxy: {},
    historyApiFallback: true,
    hot: true,
    open: true,
    https: false,
    contentBase: false,
    compress: true,
    publicPath: '/',
    // quiet: true,
    inline: true,
    // noInfo: true,
    // stats: 'errors-only',
    clientLogLevel: 'warning',
    disableHostCheck: true,
    overlay: true,
    watchOptions: {
      poll: true
    }
  }
}

module.exports = merge(
  baseConfig,
  devConfig
)
