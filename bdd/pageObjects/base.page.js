/* global browser */
/* global window */

class BasePage {
  load({ configName, stateName, width = 1000, height = 1000 }) {
    this.configName = configName;
    this.stateName = stateName;
    this.width = parseInt(width);
    this.height = parseInt(height);

    let url = `http://localhost:9000/renderExample.html?width=${this.width}&height=${this.height}&config=${this.configName}`;
    if (this.stateName) {
      url += `&state=${this.stateName}`;
    }

    browser.get(url);
    // TEMPLATE : assumes you are using Template._addRootSvgToRootElement method
    return browser.wait(browser.isElementPresent(by.css('.rhtmlwidget-outer-svg')));
  }

  getRecentState() {
    function getStateUpdates() {
      return window.stateUpdates;
    }

    return browser.executeScript(getStateUpdates).then((stateUpdates) => {
      return stateUpdates[stateUpdates.length - 1];
    });
  }
}

module.exports = BasePage;
