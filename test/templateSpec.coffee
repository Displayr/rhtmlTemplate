
describe 'Template class:', ->

  beforeEach ->
    @instantiateAndSetConfigTo = (config, width=100, height=100) ->
      @instance = new Template '<div class="outer-container">', width, height
      @instance.setConfig {}

  describe '_processConfig():', ->

    it 'accepts an empty config without throwing error', ->
      expect(=> @instantiateAndSetConfigTo({})).not.to.throw()

  describe 'e2e tests:', ->

    describe 'draw the widget:', ->

      beforeEach ->

        $('body').append('<div class="outer-container">')

        @instance = new Template $('.outer-container'), 500, 500
        @instance.setConfig {}

        @instance.draw()

      it 'has four squares', ->
        expect($('rect').length).to.equal 4
