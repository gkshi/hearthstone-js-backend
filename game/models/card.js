module.exports = function (context) {
  const normalizer = require('../../helpers/normalizer')(context)
  const ID = require('../../helpers/id')

  class Card {
    constructor (props) {
      const options = {
        id: props.id || ID(),
        group: normalizer.normalizeGroup(props.group),
        name: props.name || 'Card'
      }
      Object.keys(options).forEach(key => {
        this[key] = options[key]
      })
    }

    buy () {
      console.log('buy card', this.name)
    }

    play () {
      console.log('play card', this.name)
    }
  }

  return Card
}
