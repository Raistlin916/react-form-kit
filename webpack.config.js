var path = require('path')

if (process.env.NODE_ENV === 'example') {
  module.exports = require('./webpack.example.js')
} else {
  module.exports = {
    entry: './src/index.js',
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'index.js',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    performance: {
      hints: false
    },
    devtool: '#cheap-eval-source-map'
  }
}
