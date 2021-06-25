const puppeteer = require('puppeteer')
const { snapshotTesting: { renderExamplePageTestHelper } } = require('rhtmlBuildUtils')
const loadWidget = require('../lib/loadWidget.helper')

const {
  configureImageSnapshotMatcher,
  puppeteerSettings,
  testSnapshots,
  testState,
  jestTimeout,
} = renderExamplePageTestHelper

jest.setTimeout(jestTimeout)
configureImageSnapshotMatcher({ collectionIdentifier: 'stateInteractions' })

// NB these do not need to be persistent over time. The Ids are a convenience used to isolate tests via jest -t '11:'
let testId = 0

describe('state interactions', () => {
  let browser

  beforeAll(async () => {
    browser = await puppeteer.launch(puppeteerSettings)
  })

  afterAll(async () => {
    await browser.close()
  })

  test(`${++testId}: Select a square`, async function () {
    const { page, templatePageObject } = await loadWidget({ browser })

    await testSnapshots({ page, testName: 'initial_load' })

    await templatePageObject.selectSquare('blue')

    await testSnapshots({ page, testName: 'after_blue_square_selected' })
    await testState({ page, stateName: 'state.blue_selected', tolerance: 0 })

    await page.close()
  })

  test(`${++testId}: Load saved state and see a selected square`, async function () {
    const { page } = await loadWidget({
      browser,
      stateName: 'state.blue_selected',
    })

    await testSnapshots({ page, testName: 'after_blue_square_selected' })

    await page.close()
  })
})
