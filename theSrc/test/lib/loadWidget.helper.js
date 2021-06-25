const { snapshotTesting: { renderExamplePageTestHelper } } = require('rhtmlBuildUtils')

const {
  getExampleUrl,
  waitForWidgetToLoad,
} = renderExamplePageTestHelper

const TemplatePageObject = require('./templatePageObject')

// TODO the 'data.default_template_widget.config' default is questionable but serves this suite ...
const loadWidget = async ({
  browser,
  configName = 'config.default', // this is interpreted as a file reference to theSrc/internal_www/config/default.json !
  stateName,
  width = 1000,
  rerenderControls,
  height = 600,
}) => {
  const page = await browser.newPage()
  const url = getExampleUrl({ configName, stateName, rerenderControls, width, height })
  const templatePageObject = new TemplatePageObject(page)

  await page.goto(url)
  await waitForWidgetToLoad({ page })

  return { page, templatePageObject }
}

module.exports = loadWidget
