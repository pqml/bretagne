const path = require('path')
const paths = require('./paths.config')
const autoprefixer = require('autoprefixer')
const rupture = require('rupture')
const nib = require('nib')
const jeet = require('jeet')

module.exports = {
  entry: [
    path.join(paths.src, 'app.js'),
    path.join(paths.src, 'app.styl')
  ],
  output: {
    publicPath: paths.public,
    filename: 'bundle-[hash].js',
    chunkFilename: 'chunk-[id]-[hash].js'
  },
  plugins: [
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: paths.src,
        exclude: /node_modules/
      }
    ]
  },
  stylus: {
    use: [nib(), rupture(), jeet()],
    import: ['~nib/lib/nib/index.styl']
  },
  postcss: function () {
    return [
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ]
  }
}
