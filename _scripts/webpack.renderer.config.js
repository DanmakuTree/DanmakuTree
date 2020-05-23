const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

// const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const isDevMode = process.env.NODE_ENV === 'development'
const whiteListedModules = ['vue']

const config = {
  name: 'renderer',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? '#cheap-module-eval-source-map' : false,
  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js'),
  },
  output: {
    libraryTarget: 'umd',
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  // externals: externals.filter(d => !whiteListedModules.includes(d)),
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
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevMode,
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              // eslint-disable-next-line
              implementation: require('sass'),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevMode,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|tif?f|bmp|webp|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]',
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]',
          },
        },
      },
    ],
  },
  node: {
    __dirname: isDevMode,
    __filename: isDevMode,
  },
  plugins: [
    // new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      excludeChunks: ['processTaskWorker'],
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs')
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.PRODUCT_NAME': JSON.stringify(productName),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, '../src/'),
      src: path.join(__dirname, '../src/'),
      icons: path.join(__dirname, '../_icons/'),
    },
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  target: 'web',
}

/**
 * Adjust rendererConfig for production settings
 */
if (isDevMode) {
  // any dev only config
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
    })
  )
} else {
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/static'),
        ignore: ['.*'],
      },
    ]),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    })
  )
}

module.exports = config
