const path = require('path');

module.exports = {
  entry: './admin/src/app.jsx',
  output: {
    path: path.join(__dirname, 'admin/build/js'),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel',
        include: [path.join(__dirname, 'admin', 'src')],
        query: {
          presets: ['es2015', 'react', 'stage-1']
        }
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      }
    ]
  }
};
