const loadPage = function ({ configName, stateName, width, height }) {
  return this.context.widget.load({ configName, stateName, width, height });
};

module.exports = function () {
  this.Given(/^I am viewing "([^"]+)"$/, function (configName) {
    this.context.configName = configName;
    return loadPage.bind(this)({ configName });
  });

  this.Given(/^I am viewing "([^"]+)" with state "([^"]+)"$/, function (configName, stateName) {
    this.context.configName = configName;
    return loadPage.bind(this)({ configName, stateName });
  });

  this.Given(/^I am viewing "([^"]+)" with state "([^"]+)" and dimensions ([0-9]+)x([0-9]+)$/, function (configName, stateName, width, height) {
    this.context.configName = configName;
    return loadPage.bind(this)({ configName, stateName, width, height });
  });

  this.Given(/^I am viewing "([^"]+)" with dimensions ([0-9]+)x([0-9]+)$/, function (configName, width, height) {
    this.context.configName = configName;
    return loadPage.bind(this)({ configName, width, height });
  });
};
