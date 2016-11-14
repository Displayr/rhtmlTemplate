# TEMPLATE! - this list of dependencies and widget files needs to be kept up to date
dependencies = [
  '/external/jquery.min.js'
  '/external/lodash.min.js'
  '/external/d3.min.js'
  '/external/rHtmlStatefulWidget.js'
  { src: '/external/rHtmlSvgWidget.js', waitFor: () -> waitForTheseGlobals(['d3']) }
  '/widget/DisplayError.js'
  { src: '/widget/Template.js', waitFor: () -> waitForTheseGlobals(['d3']) }
  { src: '/js/renderContentPage.js', waitFor: () -> waitForTheseGlobals(['Template']) }
]

waitForTheseGlobals = (globals) ->
  for dependency in globals
    return false unless window.hasOwnProperty(dependency)
  return true

createScriptOnceWaitForIsTrue = (src,waitFor) ->
  myInterval = setInterval () ->
    if waitFor()
      console.log "done waiting for script #{src}"
      clearInterval myInterval
      script = document.createElement('script')
      script.setAttribute('src', src)
      body = document.getElementsByTagName("body")[0]
      body.appendChild(script)
  , 20


addDependenciesToDocument = () ->
  for dependency in dependencies
    src = if (dependency.hasOwnProperty('src')) then dependency.src else dependency
    waitCondition = if (dependency.hasOwnProperty('waitFor')) then dependency.waitFor else () -> true
    createScriptOnceWaitForIsTrue src, waitCondition

addDependenciesToDocument()
