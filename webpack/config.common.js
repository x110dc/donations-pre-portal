const WebpackAssetsManifest = require('webpack-assets-manifest');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { EnvironmentPlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { buildDir } = require('./paths');
const entries = require('./entries');

module.exports = {
  context: process.cwd(),

  entry: { ...entries },

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].chunk.[contenthash].js',
    library: 'jsBundle',
    libraryTarget: 'umd',
    publicPath: '/static/build/',
    path: buildDir,
  },

  plugins: [
    new WebpackAssetsManifest({
      output: 'assets.json',
      entrypoints: true,
    }),
    new EnvironmentPlugin([
      'NODE_ENV',
      'AUTH0_AUDIENCE',
      'AUTH0_DOMAIN',
      'AUTH0_CLIENT_ID',
      'PORTAL_API_DOMAIN',
      'ENABLE_SENTRY',
      'SENTRY_DSN',
      'SENTRY_ENVIRONMENT',
    ]),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
      root: process.cwd(),
      verbose: false,
      cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep'],
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },

    runtimeChunk: 'single',
  },

  stats: {
    warnings: false,
    cached: false,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },

      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.vue'],
  },
};
