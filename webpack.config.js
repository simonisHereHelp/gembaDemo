const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      util: require.resolve('util/'),
      process: require.resolve('process/'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
