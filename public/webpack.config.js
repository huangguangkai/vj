'use strict';

const path = require('path');

const webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3089',
    'webpack/hot/only-dev-server',
    './admin/src/app.jsx'
  ],
  output: {
      path: path.join(__dirname, 'admin', 'build'),
      filename: 'app.js',
      publicPath: 'http://127.0.0.1:3089/admin/build/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [
          'react-hot',
          'babel?presets[]=react,presets[]=es2015,presets[]=stage-1'
        ],
        include: [path.join(__dirname, 'admin', 'src')],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      }
    ]
  }
}