const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const {
    dependencies,
    devDependencies,
    productName,
} = require('../package.json')

const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const isDevMode = process.env.NODE_ENV === 'development'
const whiteListedModules = []

const config = {
    name: 'main',
    mode: process.env.NODE_ENV,
    devtool: isDevMode ? '#cheap-module-eval-source-map' : false,
    entry: {
        main: path.join(__dirname, '../src/main/index.js'),
    },
    externals: externals.filter((d) => !whiteListedModules.includes(d)),
    module: {
        rules: [
            {
                test: /\.(j|t)s$/,
                loader: ['babel-loader'],
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
        new webpack.DefinePlugin({
            'process.env.PRODUCT_NAME': JSON.stringify(productName),
        }),
    ],
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist'),
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@': path.join(__dirname, '../src/'),
            src: path.join(__dirname, '../src/'),
        },
    },
    target: 'electron-main',
}

if (isDevMode) {
    config.plugins.push(
        new webpack.DefinePlugin({
            __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
        })
    )
} else {
    const GitRevisionPlugin = require('git-revision-webpack-plugin')
    const gitRevisionPlugin = new GitRevisionPlugin()
    config.plugins.push(
        gitRevisionPlugin,
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../src/data'),
                    to: path.join(__dirname, '../dist/data'),
                },
                {
                    from: path.join(__dirname, '../static'),
                    to: path.join(__dirname, '../dist/static'),
                },
            ]
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"release"',
            'process.env.GIT_VERSION': JSON.stringify(gitRevisionPlugin.version()),
            'process.env.GIT_COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
            'process.env.GIT_BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
        })
    )
}

module.exports = config
