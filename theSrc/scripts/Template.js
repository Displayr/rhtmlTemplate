// TEMPLATE! - update the method signature here
//  -You will need to update most of this file, as this is where all the specific widget stuff goes
//  -Consider reusing this._manipulateRootElementSize() and this._addRootSvgToRootElement()

/* global document */

import $ from 'jquery'
import _ from 'lodash'
import * as d3 from 'd3'
import TemplateDependency from './TemplateDependency'
import { buildConfig } from './buildConfig'

class Template {
  static initClass () {
    this.widgetIndex = 0
    this.widgetName = 'template'
  }

  constructor (el, width, height, stateChangedCallback) {
    this.id = `${Template.widgetName}-${Template.widgetIndex++}`
    this.rootElement = _.has(el, 'length') ? el[0] : el
    this.initialWidth = width
    this.initialHeight = height
    this.state = {}
    this.stateChangedCallback = stateChangedCallback

    // NB TemplateDependency is not used,
    // it simply shows how to import and structure intra project dependencies
    const throwAway = new TemplateDependency()
    throwAway.doThings()

    this.state = {
      selected: null,
    }
  }

  resize (width, height) {
    console.log(`calling resize with w: ${width} h: ${height}`)
  }

  setUserState (userState = {}) {
    // TEMPLATE : your widget will need to handle state better
    // TODO: some sanity checks on provided state, and version check / version upgrade if versions do not match

    if (_.isUndefined(userState) || _.isNull(userState)) {
      this.state = {}
    } else {
      this.state = userState
    }
  }

  setConfig (config) {
    this.config = buildConfig(config)
    console.log('setConfig. Change this function in your rhtmlWidget')
    console.log(this.config)
  }

  _getColor (index) {
    return this.config.colors[index % this.config.colors.length]
  }

  draw () {
    this._clearRootElement()
    this._manipulateRootElementSize()
    this._addRootSvgToRootElement()
    this.outerSvg.attr(`rhtmlTemplate-status`, 'loading')
    this._draw()
    this.outerSvg.attr(`rhtmlTemplate-status`, 'ready')
    if (this.config.log)
      console.log(this.config.log)
    if (this.config.errorlog)
      console.error(this.config.errorlog)
  }

  _clearRootElement () {
    $(this.rootElement).find('*').remove()
  }

  _manipulateRootElementSize () {
    // root element has width and height in a style tag. Clear that
    $(this.rootElement).attr('style', '')

    if (this.config.resizable) {
      return $(this.rootElement).width('100%').height('100%')
    } else {
      return $(this.rootElement).width(this.initialWidth).height(this.initialHeight)
    }
  }

  _addRootSvgToRootElement () {
    const anonSvg = $('<svg class="rhtmlwidget-outer-svg">')
      .attr('id', this.id)
      .attr('width', '100%')
      .attr('height', '100%')

    $(this.rootElement).append(anonSvg)

    this.outerSvg = d3.select(anonSvg[0])

    // NB JQuery insists on lowercasing attributes, so we must use JS directly
    // when setting viewBox and preserveAspectRatio ?!
    document.getElementById(this.id).setAttribute('viewBox', `0 0 ${this.initialWidth} ${this.initialHeight}`)
    if (this.config.preserveAspectRatio) {
      document.getElementById(this.id).setAttribute('preserveAspectRatio', this.config.preserveAspectRatio)
    }

    return null
  }

  _draw () {
    console.log('_draw. Change this function in your rhtmlWidget')
    console.log('the outer SVG has already been created and added to the DOM. You should do things with it')

    const data = [
      { color: this._getColor(0), name: this._getColor(0), x: 0, y: 0 },
      { color: this._getColor(1), name: this._getColor(1), x: this.initialWidth / 2, y: 0 },
      { color: this._getColor(2), name: this._getColor(2), x: 0, y: this.initialHeight / 2 },
      { color: this._getColor(3), name: this._getColor(3), x: this.initialWidth / 2, y: this.initialHeight / 2 },
    ]

    const allCells = this.outerSvg.selectAll('.node')
      .data(data)

    const enteringCells = allCells.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)

    enteringCells.append('rect')
      .attr('width', this.initialWidth / 2)
      .attr('height', this.initialHeight / 2)
      .attr('class', 'rect')

    enteringCells.append('text')
      .attr('class', () => 'text')

    this._updateText()
    return this._updateRectangles()
  }

  _updateText () {
    this.outerSvg.selectAll('.text')
      .attr('x', () => this.initialWidth / 4) // note this is the midpoint (thats why we divide by 4 not 2)
      .attr('y', () => this.initialHeight / 4) // same midpoint consideration
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .style('fill', this.config.fontColor)
      .style('font-weight', d => (d.name === this.state.selected)
        ? this.config.fontSelectedWeight
        : this.config.fontWeight
      )
      .style('font-size', d => (d.name === this.state.selected)
        ? this.config.fontSelectedSize
        : this.config.fontSize
      )
      .text(d => d.name)
      .attr('class', (d) => {
        const classes = ['text', d.name]
        if (d.name === this.state.selected) {
          classes.push('selected')
        }
        return classes.join(' ')
      })
      .on('click', d => this._onClick(d.name))
  }

  _updateRectangles () {
    this.outerSvg.selectAll('.rect')
      .attr('class', d => `rect ${d.name}`)
      .attr('fill', d => d.color)
      .attr('stroke', 'black')
      .attr('stroke-width', (d) => {
        if (d.name === this.state.selected) { return 6 }
        return 0
      })
      .on('click', d => this._onClick(d.name))
  }

  _onClick (clickedSquareName) {
    this._updateState({ selected: clickedSquareName })
    this._draw()
  }

  _updateState (newState) {
    this.state = newState
    // TEMPLATE: this is an example of calling the state callback when the widget state changed !
    if (this.stateChangedCallback) {
      this.stateChangedCallback(this.state)
    }
  }
}
Template.initClass()

module.exports = Template
