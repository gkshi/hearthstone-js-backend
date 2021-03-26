module.exports = function (context) {
  const normalizer = require('../../helpers/normalizer')(context)

  class Hero {
    constructor (props) {
      props.group = normalizer.normalizeGroup(props.group)
      this.id = props.id || require('../../helpers/id')()
      this.name = props.name || ''
      this.group = props.group
    }
  }

  return Hero
}
