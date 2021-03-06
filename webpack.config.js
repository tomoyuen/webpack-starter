const webpack = require('webpack'),
  path = require('path'),
  HtmlwebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin');

function resolve(url) {
  return path.resolve(__dirname, url);
}

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: resolve('app'),
  output: {
    path: resolve('dist'),
    filename: `[name]${devMode ? '' : '.[hash:7]'}.js`
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: devMode,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: devMode,
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=2048'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  devServer: {
    contentBase: './build',
    historyApiFallback: false,
    hot: devMode,
    inline: true,
    progress: true,
    port: process.env.PORT || 8080
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
    assetFilter(assetFilename) {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: devMode ? 'source-map' : false,
  target: 'web',
  plugins: [
    !devMode && new MiniCssExtractPlugin({filename: '[name].[hash:7].css'}),
    !devMode && new OptimizeCSSAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', {
          svgo: false,
          discardComments: {
            removeAll: true,
          },
        }],
      },
    }),
    new HtmlwebpackPlugin({
      title: 'Hello world',
      template: resolve('app/index.html'),
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    devMode && new webpack.HotModuleReplacementPlugin(),
    !devMode && new CleanWebpackPlugin()
  ].filter(Boolean)
}
