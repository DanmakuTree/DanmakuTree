const path = require('path')
const webpack = require('webpack')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const isDevMode = process.env.NODE_ENV === 'development'

const config = {
  name: 'preload',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? '#cheap-module-eval-source-map' : false,
  entry: {
    main: path.join(__dirname, '../src/preload/main.js'),
    captcha: path.join(__dirname, '../src/preload/captcha.js'),
    plugin: path.join(__dirname, '../src/preload/module.js')
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/preload'),
    filename: '[name].js',
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  node: {
    __dirname: isDevMode,
    __filename: isDevMode,
  },
  plugins: [
    // new WriteFilePlugin(),
    new webpack.DefinePlugin({
      'process.env.PRODUCT_NAME': JSON.stringify(productName),
    }),
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/'),
      src: path.join(__dirname, '../src/'),
    },
    extensions: ['.ts', '.js', '.json'],
  },
  target: 'electron-preload',
}

/**
 * Adjust rendererConfig for production settings
 */
if (isDevMode) {
  // any dev only config
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    })
  )
}

module.exports = config
