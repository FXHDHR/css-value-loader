const path = require('path');
module.exports = {
  mode: 'development',

  entry: './index.js',
  output: {
    filename: 'example.js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: path.join(__dirname, '../lib/cssUnit-loader.js'),
            options: {},
          },
        ],
      },
    ],
  },
};
