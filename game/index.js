module.exports = function (context) {
  const globalEmit = require('../helpers/emit')(context)
  const pullGenerator = require('./pull-generator')(context)
  const statusList = [
    'not-ready',
    'preparing',
    'hero-pick',
    'ready',
    'active',
    'finished'
  ]

  class Game {
    constructor () {
      // Игроки
      this.players = []

      // Выбранные группы
      this.groups = []

      // Герои для пика
      this.heroesToPick = []

      // Оригинальные полные наборы
      this.sets = {
        groups: [],
        heroes: []
      }

      this._status = 'not-ready'
      this._inited = false
    }

    init () {
      if (this._inited) {
        console.log('already inited')
        return
      }
      this._inited = true
      globalEmit('game-status', 'preparing')

      // Генерация оригинальных наборов на первом месте
      this.generateOriginalSets()
      this.defineActiveGroups()

      globalEmit('game-status', 'hero-pick')

      this.status = 'preparing'
      globalEmit('game-preparing')
    }

    get status () {
      return this._status
    }

    set status (value) {
      if (statusList.includes(value)) {
        this._status = value
      } else {
        console.warn('Game: cannot set unknown status', value)
      }
    }

    generateOriginalSets () {
      this.sets.groups = pullGenerator.allGroups(context.config.game.groups.number)
      this.sets.heroes = pullGenerator.allHeroes(context.config.game.heroes.number)
    }

    defineActiveGroups () {
      this.groups = pullGenerator.groups(context.config.game.groups.number)
    }
  }

  return new Game()
}
