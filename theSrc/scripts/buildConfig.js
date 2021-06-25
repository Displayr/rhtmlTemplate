const _ = require('lodash')

const defaultConfig = {
  colors: ['red', 'blue', 'green', 'orange'],
  fontSelectedSize: '60px',
  fontSelectedWeight: '900',
  fontColor: '#ffffff',
  fontSize: '18px',
  fontWeight: '200',
}

const buildConfig = userConfig => _.merge({}, defaultConfig, userConfig)

module.exports = {
  buildConfig,
  defaultConfig: _.cloneDeep(defaultConfig),
}
