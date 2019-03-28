const path = require('path')

module.exports = {
  webpack(config) {
    const exlintRule = {
      enforce: 'pre',
      test: /.(js|jsx)$/,
      loader: 'eslint-loader',
      exclude: [
        path.resolve(__dirname, '/node_modules'),
      ],
    }
    config.module.rules.push(exlintRule)
    return config
  }
}
