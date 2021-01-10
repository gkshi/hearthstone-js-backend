module.exports = function (context) {
  const generator = require('./generator')(context)
  const sessionId = require('../helpers/id')
  const statusList = [
    'not-ready',
    'preparing',
    'hero-pick',
    'ready',
    'active',
    'finished'
  ]

  const initState = () => ({
    clients: [],
    players: [],
    groups: [],
    heroesToPick: [],
    sets: {
      groups: [],
      heroes: []
    },
    turn: 0,
    _status: 'not-ready',
    _inited: false
  })

  class Game {
    constructor () {
      const state = initState()
      Object.keys(state).forEach(key => {
        this[key] = state[key]
      })
    }

    init (clients) {
      if (this._inited) {
        console.log('already inited')
        return
      }
      this._inited = true
      this.setClients(clients)
      // console.log('clients setting', this.clients)

      context.emit.global('game-status', 'preparing')

      // Генерация оригинальных наборов на первом месте
      this.generateOriginalSets()
      this.defineActiveGroups()

      this.sendHeroPicks()
      context.emit.global('game-status', 'hero-pick')

      this.status = 'preparing'
    }

    reset () {
      console.log('GAME: reset', this.clients.length)
      const state = initState()
      Object.keys(state).forEach(key => {
        this[key] = state[key]
      })
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

    /**
     * Получение общего игрового состояния для клиента
     * @returns {object}
     */
    getState () {
      return {
        players: this.players,
        groups: this.groups,
        status: this.status,
        turn: this.turn
      }
    }

    setClients (clients) {
      this.clients = clients.map(client => ({
        sessionId: sessionId(),
        socket: client
      }))

      this.clients.forEach(client => {
        context.emit.toClient(client.sessionId, 'session-id', client.sessionId)
      })
    }

    getClient (sessionId, socketId) {
      if (socketId) {
        return this.clients.find(i => i.socket.id === socketId)
      }
      return this.clients.find(i => i.sessionId === sessionId)
    }

    updateClient (sessionId, payload) {
      const client = this.getClient(sessionId)
      console.log('updateClient', sessionId, Object.keys(payload))
      console.log('client', !!client)
      if (!client) {
        console.warn('[GAME: updateClient] No client found with sessionId', sessionId)
        return
      }
      Object.keys(payload).forEach(key => {
        client[key] = payload[key]
      })
    }

    generateOriginalSets () {
      this.sets.groups = generator.allGroups(context.config.game.groups.number)
      this.sets.heroes = generator.allHeroes(context.config.game.heroes.number)
    }

    defineActiveGroups () {
      this.groups = generator.groups(context.config.game.groups.number)
    }

    addPlayer (sessionId, socketId, heroId) {
      const hero = this.sets.heroes.find(i => i.id === heroId)
      this.players.push({
        sessionId,
        socketId,
        hero,
        status: 'active'
      })
    }

    getPlayer (sessionId, socketId) {
      if (socketId) {
        return this.players.find(player => player.socketId === socketId)
      }
      return this.players.find(player => player.sessionId === sessionId)
    }

    updatePlayer (sessionId, payload) {
      console.log('update player:', sessionId, payload)
      const player = this.getPlayer(sessionId)
      console.log('player found:', player)
      if (!player) {
        console.warn('[GAME: updatePlayer] No player found with sessionId', sessionId)
        return
      }
      console.log('payload keys', Object.keys(payload))
      Object.keys(payload).forEach(key => {
        console.log('player[key]', player[key], key)
        player[key] = payload[key]
      })
    }

    /**
     * Генерирует героев для пика и посылает их клиентам
     */
    sendHeroPicks () {
      let all = [...this.sets.heroes]
      this.clients.forEach(client => {
        const set = generator._random(all, context.config.game.heroes.numberToPick, true)
        // console.log('set', set)
        all = all.map(i => {
          if (!set.includes(i)) {
            return i
          }
        })
        // console.log('all', all)
        context.emit.toClient(client.sessionId, 'game-hero-pick', set)
      })
      // console.log('all 2', all)
    }
  }

  return new Game()
}
