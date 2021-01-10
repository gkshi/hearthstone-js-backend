module.exports = function (context) {
  const Group = require('./groups/model')
  const groups = require('./groups')

  const Hero = require('./heroes/model')
  const heroes = require('./heroes')

  class PullGenerator {
    allGroups () {
      const result = []
      groups.forEach(props => {
        result.push(new Group(props))
      })
      return this._random(result, result.length)
    }

    groups (length) {
      const result = []
      groups.forEach(group => {
        result.push(group)
      })
      return this._random(result, length)
    }

    allHeroes () {
      const list = require('./heroes')
      const result = []
      list.forEach(item => {
        const modified = { ...item }
        modified.group = modified.group
          ? context.game.sets.groups.find(i => i.alias === item.group)
          : null
        result.push(new Hero(modified))
      })
      return this._random(result, result.length)
    }

    heroes (length) {
      const result = []
      heroes.forEach(item => {
        const modified = { ...item }
        if (item.group) {
          modified.group = context.game.groups.find(i => i.alias === item.group)
        }
        result.push(new Hero(modified))
      })
      // if (groups) {
      //   set = set.map(hero => hero.group)
      // }
      return this._random(result, length)
    }

    _random (array = [], number = 1, withSplice = false) {
      const from = withSplice ? array : [...array]
      const res = []
      for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * from.length)
        res.push({ ...from[randomIndex] })
        from.splice(randomIndex, 1)
      }
      return number === 1 ? res[0] : res
    }
  }

  return new PullGenerator()
}
