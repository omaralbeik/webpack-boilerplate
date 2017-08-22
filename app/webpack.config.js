const webpack = require('webpack');
const path = require("path");
const glob = require('glob');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const inProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    app: [
      './src/app.js',
      './src/scss/styles.scss'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(svg|oet|ttf|woff|woff2)$/,
        use: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]'
            }
          },
          {
            loader: 'img-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
    new ExtractTextPlugin('styles.css'),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'index.html')),
      minimize: inProduction
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: inProduction
    })
  ]
};


if (inProduction) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  )
}
