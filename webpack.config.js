const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader')

module.exports = {
  context: path.resolve("./src/main"),
  entry: {
    'app': './server.ts'
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].bundle.js",
  },
  target: "node",
  externals: [
    nodeExternals()
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'awesome-typescript-loader',
        exclude: ["node_modules"]
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    plugins: [
      new TsConfigPathsPlugin()
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      $dirname: '__dirname',
    })
  ],
  node: {
    __filename: false,
    __dirname: false
  }
}
