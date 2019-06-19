const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader?limit=9000000&name=assets/[name].[ext]'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 200000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  performance: {
    hints: false
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js', '.vue', '.json', '.ts']
  },
  plugins: [new VueLoaderPlugin()]
}
