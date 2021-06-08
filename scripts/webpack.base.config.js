const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const TerserJSPlugin = require('terser-webpack-plugin');

const { resolve } = path;
const srcDir = path.join(__dirname, '../src');

const buildEnv = process.env.BUILD_ENV;
// 复用loader
const commonCssLoader = [
  buildEnv === "native-dev" ? 'style-loader' : {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../',
    },
  },
  'css-loader',
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          [
            "postcss-preset-env",
          ],
        ],
      }
    }
  }
];

module.exports = {
  entry: resolve(__dirname, '../src/test/index.js'),
  output: {
    filename: './js/[name].js',
    path: resolve(__dirname, '../lib')
    // filename: 'component-library.js',
    // path: resolve(__dirname, '../lib'),
    // libraryTarget: 'commonjs2'
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: resolve(__dirname, '../lib'),
    hot: true,
    // open: true,
    host: 'localhost',
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          }
        }
      },
      {
        test: /\.css$/,
        use: [...commonCssLoader]
      }
    ]
  },
  resolve: {
    alias: {
      '@': srcDir,
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.js', '.jsx']
  },
  plugins: {
    // 清理dist包
    cleanWebpack: new CleanWebpackPlugin(),
    // 配置入口页面
    html: new HtmlWebpackPlugin({ template: './public/index.html' }),
    // 热更新
    hotModuleReplacement: new webpack.HotModuleReplacementPlugin(),
    // 全局变量
    DefinePlugin: new webpack.DefinePlugin({
      'buildEnv': JSON.stringify(process.env.BUILD_ENV),
      'appName': JSON.stringify(process.env.APP_NAME)
    }),
    miniCssExtract: new MiniCssExtractPlugin({
      filename: `css/[name].[contenthash:10].css`
    })
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
    splitChunks: { chunks: 'all' }
  },
}
