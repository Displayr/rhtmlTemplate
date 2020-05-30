const cliArgs = require('yargs').argv
const _ = require('lodash')

const config = {
  widgetEntryPoint: 'theSrc/scripts/rhtmlTemplate.js',
  widgetFactory: 'theSrc/scripts/rhtmlTemplate.factory.js',
  widgetName: 'rhtmlTemplate',
  internalWebSettings: {
    includeDimensionsOnWidgetDiv: true,
    default_border: false,
    css: [],
    isReadySelector: 'svg[rhtmlTemplate-status=ready]',
    singleWidgetSnapshotSelector: '#widget-container'
  },
  snapshotTesting: {
    consoleLogHandler: () => { }, // use this to suppress logging in snapshot testing
    // consoleLogHandler: (msg, testName) => { console.log(`${testName}: ${msg.args().join(',')}`) }, // use this to echo logging in snapshot testing
    testplanDirectory: 'theSrc/test/snapshotTestDefinitions',
    interactionTestDirectory: 'theSrc/test/bin',
    snapshotDirectory: 'theSrc/test/snapshots'
  }
}

const commandLineOverides = _.omit(cliArgs, ['_', '$0'])
module.exports = _.merge(config, commandLineOverides)
