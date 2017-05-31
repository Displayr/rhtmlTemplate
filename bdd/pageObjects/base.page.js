/* global browser */
/* global window */

class BasePage {
  load({ configName, stateName, width = 1000, height = 1000, rerender = false }) {
    this.configName = configName;
    this.stateName = stateName;
    this.width = parseInt(width);
    this.height = parseInt(height);

    let url = `http://localhost:9000/renderExample.html?width=${this.width}&height=${this.height}&config=${this.configName}`;
    if (this.stateName) {
      url += `&state=${this.stateName}`;
    }
    if (rerender) {
      url += '&rerender=true';
    }


    browser.get(url);
    // TEMPLATE : assumes you are using Template._addRootSvgToRootElement method
    return browser.wait(browser.isElementPresent(by.css('.rhtmlwidget-outer-svg')));
  }

  rerender({ widgetIndex = 0, configName }) {
    element(by.css(`.example-${widgetIndex} .rerender-config`)).clear().sendKeys(configName);
    return element(by.css(`.example-${widgetIndex} .rerender-button`)).click();
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
