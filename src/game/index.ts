module.exports = function (context) {
  const globalEmit = require('../helpers/emit.ts')(context)

  const statusList = ['not-ready', 'preparing', 'ready']

  class Game {
    constructor () {
      this.config = require('../../config/index.ts')
      this.players = []
      this.pulls = {}

      this._status = 'not-ready'
      this._inited = false
    }

    init () {
      if (this._inited) {
        console.log('already inited')
        return
      }
      console.log('game init')
      globalEmit('game-init')
      this._inited = true

      // TODO: здесь будет генерация сетов (герои, карты)

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
  }

  const game = new Game()

  return game
}
