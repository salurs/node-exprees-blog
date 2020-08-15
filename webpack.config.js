const path = require('path');
const webpack = require('webpack');
// const jquery = require('jquery');
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: './public/admin/index.js',
  },
  output: {
    filename: 'main.js',
    path: __dirname + '/public/admin/bundle/'
  },
  module: {
    rules: [
      {
        test: [/.js$/],
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: [/.css$|.scss$|.sass$/],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      // {
      //   test: require.resolve('jquery'),
      //   loader: 'expose-loader',
      //   options: {
      //     exposes: ['$', 'jQuery'],
      //   },
      // },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   template: './public/admin/bundle/index.html',
    //   inject: true
    // }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    // new webpack.ProvidePlugin({
    //     '$': 'jquery',
    //  })
  ],
  resolve: {
    alias: {
        'node_modules': path.join(__dirname, 'node_modules'),
        // jquery: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.js')
    }
}
}