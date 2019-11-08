const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader', 
        options: {
            name: './public/images/[name].[ext]'                    
        }               
    }, 
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=./public/fonts/[name].[ext]'
    },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
   
    new HtmlWebpackPlugin({      
      template: './src/public/index.html',   
    }),    
  ],
  devServer: {
    contentBase: './src/public',
    port: 5500,
  }, 
};