const request = require('request-promise');
const wrapInPromiseAndLogErrors = require('../support/wrapInPromiseAndLogErrors');

module.exports = function () {
  this.When(/^I click the "([^"]+)" square$/, function (squareName) {
    return this.context.widget.selectSquare(squareName);
  });

  this.Then(/^the final state callback should match "(.*)"$/, function (expectedStateFile) {
    if (!this.context.configName) {
      throw new Error('Cannot state match without configName');
    }

    return wrapInPromiseAndLogErrors(() => {
      const expectedStateUrl = `http://localhost:9000/data/${this.context.configName}/${expectedStateFile}.json`;
      const expectedStatePromise = request(expectedStateUrl).then(JSON.parse);
      const actualStatePromise = this.context.widget.getRecentState();

      return Promise.all([actualStatePromise, expectedStatePromise]).then(([actualState, expectedState]) => {
        this.expect(actualState).to.deep.equal(expectedState);
      });
    });
  });

  this.Then(/^the "([^"]+)" square should be selected$/, function (squareName) {
    return this.context.widget.isSelected(squareName).then((isSelected) => {
      this.expect(isSelected).to.equal(true);
    });
  });
};
