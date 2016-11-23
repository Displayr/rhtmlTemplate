module.exports = function(config) {

  config.set({
    // browsers: ['PhantomJS'],
    browsers: ['Chrome'],
    basePath: '../../',
    files: require('./externalLibs.json').concat([
      // TEMPLATE! - this list of coffee source files needs to be changed to match your project
      'theSrc/scripts/DisplayError.coffee',
      'theSrc/scripts/Template.coffee',
      'theSrc/scripts/**/*.spec.coffee'
    ]),

    frameworks: ['mocha', 'sinon-chai', 'chai-dom', 'chai-as-promised', 'chai', 'sinon'],

    preprocessors: {
      '**/*.coffee': ['coffee']
    },

    phantomjsLauncher: {
      exitOnResourceError: true
    },

    coffeePreprocessor: {
      options: {
        bare: true,
        sourceMap: false
      },
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js')
      }
    }
  })
};

