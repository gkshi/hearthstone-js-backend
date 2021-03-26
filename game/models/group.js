function normalizeGroupProps (props = 'any') {
  if (typeof props === 'string') {
    return {
      alias: props
    }
  }
  return props
}

class Group {
  constructor (props) {
    props = normalizeGroupProps(props)
    this.id = props.id || require('../../helpers/id')()
    this.name = props.name || ''
    this.alias = props.alias || ''
  }
}

module.exports = Group
