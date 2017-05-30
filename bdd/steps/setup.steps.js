const _ = require('lodash');

const World = require('../support/world');
const TemplatePage = require('../pageObjects/template.page');
const widgetName = require('../../build/config/widget.config.json').widgetName;

/* global browser */

// this is duplicated in allTheSteps.js
const isApplitoolsEnabled = () => {
  return !(_.get(browser, 'params.applitools') === 'off');
};


module.exports = function () {
  this.World = World;
  this.setDefaultTimeout(180 * 1000); // TODO configurable ?

  this.Before(function () {
    browser.ignoreSynchronization = true;
    this.context = {
      // TEMPLATE: you will need to use your own page object here
      // NB: This is not the instance class for the widget, it is a page object
      //     that abstracts interaction with the widget
      widget: new TemplatePage(),
    };
  });

  this.Before('@applitools', function (scenario) {
    if (isApplitoolsEnabled()) {
      const applitoolsParameters = {
        width: global.visualDiffConfig.browserWidth,
        height: global.visualDiffConfig.browserHeight,
      };
      this.eyes.open(browser, widgetName, scenario.getName(), applitoolsParameters);
    }
  });

  this.After('@applitools', function () {
    if (isApplitoolsEnabled()) {
      this.eyes.close(false);
    }
  });
};
