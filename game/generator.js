module.exports = function (context) {
  const Group = require('./models/group')
  const groups = require('./groups')

  const Hero = require('./models/hero')(context)
  const heroes = require('./heroes')

  const Card = require('./models/card')(context)

  class PullGenerator {
    /**
     * Генерирует массив со всеми группами
     * @returns {array}
     */
    allGroups () {
      const result = []
      groups.forEach(props => {
        result.push(new Group(props))
      })
      return this._random(result, result.length)
    }

    /**
     * Возвращает массив с группами нужной длины
     * @param set {array}
     * @param length {number}
     * @returns {array}
     */
    groups (set, length) {
      return this._random(set, length)
    }

    /**
     * Генерирует массив со всеми героями
     * @returns {array}
     */
    allHeroes () {
      const list = require('./heroes')
      console.log('list', list)
      const result = []
      list.forEach(item => {
        console.log('item', item)
        const modified = { ...item }
        modified.group = modified.group
          ? context.game.sets.groups.find(i => i.alias === item.group)
          : null
        const hero = new Hero(modified)
        console.log(':: heor', hero, hero.name)
        result.push(hero)
      })
      console.log('result', result)
      const randomized = this._random(result, result.length)
      console.log('randomized', randomized)
      return randomized
    }

    /**
     * Генерирует массив с героями нужной длины
     * @param length {number}
     * @returns {array}
     */
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

    /**
     * Генерирует массив со всеми картами (без копий, без экземпляров групп внутри)
     * @returns {array}
     */
    fullDeck () {
      const result = []
      const cards = require('./cards')
      cards.forEach(card => {
        result.push(new Card(card))
      })
      return result
    }

    /**
     * Генерирует массив с игровыми картами (главная игровая колода, с копиями)
     * @returns {array}
     */
    gameDeck () {
      const fullDeck = this.fullDeck()
      const availableGroups = context.game.groups.map(i => i.alias)
      const result = []
      // context.config.deck.copies.default
      fullDeck.forEach(card => {
        console.log('card', card)
        const modified = { ...card }
        if (modified.group && !availableGroups.includes(modified.group.alias)) {
          return
        }
        result.push(new Card(modified))
      })
      return result
    }

    /**
     * Возвращает нужное количество элементов из массива в рандомном порядке
     * @param array
     * @param number
     * @param withSplice
     * @returns {any}
     * @private
     */
    _random (array = [], number = 1, withSplice = false) {
      const from = withSplice ? array : [...array]
      console.log('from', from)
      const res = []
      for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * from.length)
        console.log('randomIndex', randomIndex, from[randomIndex])
        const target = from[randomIndex]
        console.log('target', target, target.name)
        res.push({ ...target })
        console.log('res', res)
        from.splice(randomIndex, 1)
      }
      return number === 1 ? res[0] : res
    }
  }

  return new PullGenerator()
}
