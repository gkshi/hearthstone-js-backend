const config = require('../../config/index.ts')
const Game = require('../game/index.ts')

class Context {
  constructor () {
    this.clients = []
    this.game = null
    this.io = null
  }
}

// const clients = new Proxy([], {
//   get: function (target, name) {
//     return target[name]
//   },
//   set: function (target, property, value, receiver) {
//     if (target.length >= config.players.number) {
//       context.game.init()
//     }
//     return true
//   }
// })

// context.clients = clients

const context = new Context()
context.game = new Game(context)

module.exports = context
