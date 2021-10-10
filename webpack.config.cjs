// @ts-check

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');


const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const mode = process.env.NODE_ENV || 'development';

module.exports = () => {

  const plugins = [];

  if (mode !== 'production') {
    const env = dotenv.config().parsed;
    const envKeys = Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {});
    plugins.push(new webpack.DefinePlugin(envKeys))
  } else {
    plugins.push(new webpack.DefinePlugin({'process.env.API_URL': process.env.API_URL}))
  }

  return {
    mode,
    entry: {
      main: path.join(__dirname, 'src', 'index.jsx'),
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    output: {
      path: path.join(__dirname, 'dist', 'public'),
      publicPath: '/assets/',
    },
    devServer: {
      compress: true,
      port: 8080,
      host: '0.0.0.0',
      publicPath: '/assets/',
      historyApiFallback: true,
    },
    plugins: [
      new MiniCssExtractPlugin(),
      ...plugins,
    ],
    module: {
      rules: [
        {
          test: /\.(jsx|js)?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' },
          ],
        },
      ],
    },
  }
};
