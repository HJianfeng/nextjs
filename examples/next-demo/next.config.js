const path = require('path')
const withLess = require('@zeit/next-less')

if (typeof require !== 'undefined') {
  require.extensions['.less'] = () => {}
}
module.exports = withLess({
  useFileSystemPublicRoutes: false,
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack(config) {
    const eslintRule = {
      enforce: 'pre',
      test: /.(js|jsx)$/,
      loader: 'eslint-loader',
      exclude: [
        path.resolve(__dirname, '/node_modules'),
      ],
    }
    config.module.rules.push(eslintRule)
    return config
  },
})
