const path = require('path')
const merge = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const HappyPack = require('happypack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const happyThreadPool = HappyPack.ThreadPool({ size: 5 })

const utils = require('./utils')

let baseConfig = require('./webpack.base.config')

let prodConfig = {
  mode: 'production',
  entry: {
    vendors: ['phaser']
  },
  output: {
    publicPath: '/',
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Phaser3 DEMO',
      filename: 'index.html',
      meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'},
      template: './src/index.html',
      inject: true,
      chunks: ['vendors', 'app'],
      chunksSortMode: 'dependency',
      minify: {
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        useShortDoctype: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
      }
    }),
    new HappyPack({
      id: 'babel',
      threadPool: happyThreadPool,
      loaders: utils.babelLoaders()
    }),
    new HappyPack({
      id: 'css',
      threadPool: happyThreadPool,
      loaders: utils.cssLoaders()
    }),
    new HappyPack({
      id: 'stylus',
      threadPool: happyThreadPool,
      loaders: utils.stylusLoaders()
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css',
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        exclude: /\.min\.js$/,
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false,
        uglifyOptions: {
          compress: {
            unused: true,
            warnings: false,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
          assetNameRegExp: /\.css$/,
          // cssProcessor: require('cssnano'), // default
          cssProcessorOptions: {
            safe: true,
            // autoprefixer: { disable: true },
            discardComments: {
                removeAll: true
            }
          },
          canPrint: true
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          minSize: 30000,
          minChunks: 1,
          chunks: 'initial',
          priority: 1
        }
      }
    }
  }
}

module.exports = merge(
  baseConfig,
  prodConfig
)
