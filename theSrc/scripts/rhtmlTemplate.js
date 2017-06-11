/* global HTMLWidgets */

import _ from 'lodash'
import Template from './Template'
import DisplayError from './DisplayError'

// TEMPLATE! - update the template name below. Rename this file to match your widget name.
//  -In theory you dont ned to change anything else, but you can at your own discretion
HTMLWidgets.widget({
  name: 'rhtmlTemplate',
  type: 'output',

  factory (element, width, height, stateChangedCallback) {
    // TEMPLATE! - update the class name below to the name of your main class
    const instance = new Template(element, width, height, stateChangedCallback)
    return {
      resize (newWidth, newHeight) {
        instance.resize(newWidth, newHeight)
      },

      renderValue (incomingConfig, userState) {
        let config = null
        try {
          if (_.isString(incomingConfig)) {
            config = JSON.parse(incomingConfig)
          } else {
            config = incomingConfig
          }
        } catch (err) {
          const readableError = new Error(`Template error : Cannot parse 'settingsJsonString': ${err}`)
          console.error(readableError)
          const errorHandler = new DisplayError(element, readableError)
          errorHandler.draw()
          throw new Error(err)
        }

        // @TODO for now ignore the width height that come through from config and use the ones passed to constructor
        // @TODO need to change this to match rhtmlPictograph
        delete config.width
        delete config.height

        try {
          instance.setConfig(config)
          instance.setUserState(userState)
          return instance.draw()
        } catch (err) {
          console.error(err.stack)
          const errorHandler = new DisplayError(element, err)
          errorHandler.draw()
          throw new Error(err)
        }
      }
    }
  }
})
