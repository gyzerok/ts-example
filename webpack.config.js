var webpack = require('webpack');

module.exports = {
  // Selected according to http://cheng.logdown.com/posts/2016/03/25/679045
  devtool: 'cheap-module-eval-source-map',

  entry: './src/index.tsx',

  output: {
    path: './public',
    filename: 'app.js'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: [
          'awesome-typescript-loader'
        ]
      },
    ],
  },

  devServer: {
    clientLogLevel: 'none',
    // We put the whole src directory here, but actually we want only index.html
    // to be served statically during development, other stuff is served by webpack.
    contentBase: './public',
    publicPath: '/',
    historyApiFallback: true,
    inline: true,
    hot: true,
    noInfo: true,
    port: 3000,
  }
};