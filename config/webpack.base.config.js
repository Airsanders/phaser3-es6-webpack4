const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const utils = require('./utils')

let webpackConfig = {
  cache: true,
  devtool: false,
  entry: {
    app: './src/app.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.styl'],
    alias: {
      '@': utils.resolve('src')
    }
  },
  module: {
    rules: utils.getLoaders()
  },
  plugins: [
    new webpack.DefinePlugin({
      WEBGL_RENDERER: true,
      CANVAS_RENDERER: true,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV === 'development' ? 'development' : 'production')
      }
    }),
    // copy static assets file
    new CopyWebpackPlugin([
      {
        from: utils.resolve('assets'),
        to: utils.resolve('dist/assets')
      }
    ])
  ]
}

module.exports = webpackConfig
