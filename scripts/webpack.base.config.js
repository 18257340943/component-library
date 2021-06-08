const path = require('path');

const TerserJSPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { resolve } = path;
const srcDir = path.join(__dirname, '../src');
// console.log(process.env, 'process.env');

// 复用loader
const commonCssLoader = [
  devMode ? 'style-loader' : {
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
    filename: 'component-library.js',
    path: resolve('../lib'),
    libraryTarget: 'commonjs2'
  },
  devServer: {
    contentBase: resolve('../lib/component-library.js'),
    hot: true,
    // open: true,
    host: 'localhost',
    port: 8080,
  },
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
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
        use: [
          BUILD_ENV === "native-dev" ? 'style-loader' : ,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('autoprefixer')()
              ],
            }
          }
        ]
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
    DefinePlugin: new webpack.DefinePlugin({
      'BUILD_ENV': JSON.stringify(BUILD_ENV)
    })
  }
}
