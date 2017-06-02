const loadPage = function ({ configName, stateName, width, height, rerender }) {
  return this.context.widget.load({ configName, stateName, width, height, rerender });
};

module.exports = function () {
  this.Given(/^I am viewing "([^"]+)" with dimensions ([0-9]+)x([0-9]+)$/, function (configName, width, height) {
    this.context.configName = configName;
    return loadPage.bind(this)({ configName, width, height });
  });

  this.Given(/^I am viewing "([^"]+)" with state "([^"]+)" and dimensions ([0-9]+)x([0-9]+)$/, function (configName, stateName, width, height) {
    this.context.configName = configName;
    return loadPage.bind(this)({ configName, width, height, stateName });
  });

  this.Given(/^I am viewing "([^"]+)" with dimensions ([0-9]+)x([0-9]+) and rerender controls$/, function (configName, width, height) {
    this.context.configName = configName;
    return loadPage.bind(this)({ configName, width, height, rerender: true });
  });

  this.Given(/^I am viewing "([^"]+)" with state "([^"]+)" and dimensions ([0-9]+)x([0-9]+) and rerender controls$/, function (configName, stateName, width, height) {
    this.context.configName = configName;
    return loadPage.bind(this)({ configName, width, height, stateName, rerender: true });
  });

  this.Given(/^I rerender with config "([^"]+)"$/, function (configName) {
    this.context.configName = configName;
    return this.context.widget.rerender({ configName });
  });
};
