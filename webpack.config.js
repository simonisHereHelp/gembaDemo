const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      util: require.resolve('util/'),
      process: require.resolve('process/'),
      extensions: ['.js', '.jsx', '.json'],
      alias: {
         '@mediapipe': path.resolve(__dirname, 'node_modules/@mediapipe'),
      },
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
