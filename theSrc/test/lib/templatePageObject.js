
class TemplatePageObject {
  constructor (page) {
    this.page = page
  }

  async selectSquare (squareName) {
    return this.page.click(`.text.${squareName}`)
  }
}

module.exports = TemplatePageObject
