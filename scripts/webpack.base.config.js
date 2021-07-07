const path = require('path');
const srcDir = path.join(__dirname, '../src');


const webpackConfigBase = {

  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', "@babel/preset-env"],
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
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
}
module.exports = webpackConfigBase
