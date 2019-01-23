const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'

exports.babelLoaders = () => {
  const babelLoader = {
    loader: 'babel-loader'
  }
  return [babelLoader]
}

exports.cssLoaders = () => {
  const cssLoader = {
    loader: 'css-loader'
  }

  const postcssLoader = {
    loader: 'postcss-loader'
  }

  const styleLoader = {
    loader: 'style-loader'
  }

  return isProd ? [cssLoader, postcssLoader] : [styleLoader, cssLoader, postcssLoader]
}

exports.stylusLoaders = () => {
  const stylusLoader = {
    loader: 'stylus-loader'
  }
  return exports.cssLoaders().concat(stylusLoader)
}

exports.getLoaders = () => {
  let loaders = [
    {
      test: /\.js$/,
      include: /src/,
      use: isProd ? 'happypack/loader?id=babel' : exports.babelLoaders
    },
    // for css file
    {
      test: /\.css$/,
      include: /src/,
      use: isProd ? [MiniCssExtractPlugin.loader, 'happypack/loader?id=css'] : exports.cssLoaders()
    },
    // for stylus file
    {
      test: /\.styl$/,
      include: /src/,
      use: isProd ? [MiniCssExtractPlugin.loader, 'happypack/loader?id=stylus'] : exports.stylusLoaders()
    }
  ]

  if (isProd) {
    loaders = loaders.concat([
        // for static assets
        {
          test: /\.(jpe?g|png|gif|ico)$/,
          include: /assets/,
          use: {
            loader: 'file-loader',
            options: {
              emitFile: false,
              name: '[path][name].[ext]',
              outputPath: 'assets/images'
            }
          }
        },
        // for css images
        {
          test: /\.(jpe?g|png|gif|ico)$/,
          exclude: /assets/,
          use: isProd ? 
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[hash:7].[ext]',
                outputPath: 'images'
              }
            } : 'file-loader'
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: isProd ? 
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[hash:7].[ext]',
                outputPath: 'fonts'
              }
            } : 'file-loader'
        },
        {
          test: [/\.vert$/, /\.frag$/],
          use: 'raw-loader'
        },
    ])
  }

  return loaders
}

exports.resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}