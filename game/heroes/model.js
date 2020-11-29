const Group = require('../groups/model')

function normalizeGroup (group) {
  if (!group) {
    return null
  }
  if (typeof group === 'string') {
    return new Group(group)
  }
  return group
}

class Hero {
  constructor (props) {
    props.group = normalizeGroup(props.group)
    this.id = props.id || require('../../helpers/id')()
    this.name = props.name || ''
    this.group = props.group
  }
}

module.exports = Hero
