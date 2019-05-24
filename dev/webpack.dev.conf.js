var path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: path.resolve(__dirname, './public/index.js'),
  output: {
    path: path.resolve(__dirname, './public'),
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: 'index.min.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
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
        loader: 'url-loader?limit=50000&name=assets/[name].[ext]'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 20000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, './src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: 'source-map',
  externals: ['fs', 'url', 'process', 'child_process'],
  plugins: [
    new VueLoaderPlugin()
  ]
}


