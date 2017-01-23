'use strict';

const _ = require('lodash');
const widgetName = require('../config/widget.config.json').widgetName;

// NB global.visualDiffConfig is set globally in protractor.conf.js
const eyes = require('./initializeApplitools').getEyes(global.visualDiffConfig)

const contentManifest = require('../../browser/content/contentManifest.json')
let contentFiles = _.flattenDeep(_.values(contentManifest))

if (_.has(global.visualDiffConfig, 'specFilter')) {
  const specFilterRegex = new RegExp(global.visualDiffConfig.specFilter);
  contentFiles = contentFiles.filter( (candidatePath) => {
    return specFilterRegex.test(candidatePath);
  });
}

let snapshotsCount = 0;
describe('Take visual regression snapshots', function () {

  beforeEach(function () {
    browser.ignoreSynchronization = true;
  });

  _.forEach(contentFiles, (contentPath) => {
    it(`Capturing ${contentPath} visual regression content`, function(done) {

      let openedEyes = false;

      browser.get(contentPath).then( () => {
        console.log(`Page ${contentPath} is loaded`);
      }).then(() => {
        return element.all(by.css('[snapshot-name]')).count();
      }).then((count) => {
        if (count > 0) {

          eyes.open(
            browser,
            `${widgetName} ${global.visualDiffConfig.testLabel}`,
            contentPath,
            { width: global.visualDiffConfig.browserWidth, height: global.visualDiffConfig.browserHeight }
          );
          openedEyes = true;

          console.log(`Waiting ${global.visualDiffConfig.pageLoadWaitSeconds * 1000} seconds for widgetsPage`);
          return new Promise((resolve) => {
            setTimeout(() => {
              return resolve()
            }, global.visualDiffConfig.pageLoadWaitSeconds * 0);
          });
        } else {
          console.log(`No snapshots on ${contentPath}. Skipping`);
          return Promise.resolve();
        }
      }).then( () => {
        const donePromises = element.all(by.css('[snapshot-name]')).each(function(element) {
          return element.getAttribute('snapshot-name').then( (snapshotName) => {
            if (snapshotName) {
              console.log(`take snapshot ${contentPath} ${snapshotName}`);
              snapshotsCount++;
              eyes.checkRegionBy(by.css(`[snapshot-name="${snapshotName}"]`), snapshotName);
            }
            else {
              console.error(`snapshot on page ${contentPath} missing snapshot name`);
            }
          });
        });
        return donePromises;
      }).then( () => {
        console.log(`done taking snapshots on ${contentPath}. Running snapshot count: ${snapshotsCount}`);
        if (openedEyes) { eyes.close(false); }
        done();
      }).catch( (error) => {
        console.log("test error:");
        console.log(error)
        if (openedEyes) { eyes.close(false); }
        done();
      })
    })
  })
})



