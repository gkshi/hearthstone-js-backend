module.exports = function (http, context) {
  const io = require('socket.io')(http, {
    cors: {
      origin: '*'
    }
  })

  io.use(function (socket, next) {
    const handshakeData = socket.request
    const sessionId = +handshakeData._query?.sessionId || null
    context.clients.push(socket)

    console.log('connected:', socket.id, sessionId)
    const gameExistingClient = context.game.getClient(sessionId)
    const gameExistingPlayer = context.game.getPlayer(sessionId)

    if (gameExistingClient && gameExistingPlayer) {
      if (gameExistingPlayer.status === 'capitulated') {
        console.log('player has been capitulated')
        return
      }
      console.log('return to the game here')
      context.game.updateClient(gameExistingClient.sessionId, {
        socket: socket
      })
      context.game.updatePlayer(gameExistingClient.sessionId, {
        socketId: socket.id,
        status: 'connected'
      })
      context.emit.toClient(sessionId, 'reconnect', context.game.getState())
    }

    context.emit.global('clients-status', {
      clients: context.clients.length,
      findingGameClients: context.findingGameClients.length
    })

    // Max clients number passed, starting a game
    // if (context.config.game.heroes.number === context.clients.length && !context.game._inited) {
    //   context.game.init(context.clients)
    // }
    next()
  })

  io.on('connection', socket => {
    socket.on('game-player-picked-hero', heroId => {
      console.log('------')
      console.log('player-hero-pick', heroId)
      console.log('all clients', context.game.clients.map(i => ({ sessionId: i.sessionId, socketId: i.socket.id })))
      console.log('current socket', socket.id)
      const client = context.game.getClient(null, socket.id)
      console.log('client', Object.keys(client), client.sessionId)
      context.game.addPlayer(client.sessionId, socket.id, heroId)

      if (context.game.players.length === context.config.lobby.players.number) {
        context.emit.toPlayers('game-start', context.game.players)
      }
    })

    socket.on('clients-status', () => {
      socket.emit('clients-status', {
        clients: context.clients.length,
        findingGameClients: context.findingGameClients.length
      })
    })

    socket.on('find-game', () => {
      console.log('find-game', socket.id)
      context.findingGameClients.push(socket)
      if (context.config.game.heroes.number === context.findingGameClients.length && !context.game._inited) {
        context.game.init(context.clients)
        context.findingGameClients = []
      }
    })

    socket.on('capitulate', () => {
      console.log('capitulate', socket.id)
      const client = context.game.getClient(null, socket.id)
      if (client) {
        context.game.updatePlayer(client.sessionId, {
          status: 'capitulated'
        })
      }
    })

    socket.on('disconnect', () => {
      console.log('disconnected:', socket.id)

      const client = context.game.getClient(null, socket.id)
      if (client) {
        context.game.updatePlayer(client.sessionId, {
          status: 'disconnected'
        })
      }

      const i = context.clients.indexOf(socket)
      context.clients.splice(i, 1)

      console.log('context.clients', context.clients.map(i => i.id))
      console.log('context.game.clients', context.game.clients.map(i => i.sessionId))

      if (!context.clients.length) {
        console.log('no clients, reset game')
        context.game.reset()
        return
      }

      context.emit.global('clients-status', {
        clients: context.clients.length,
        findingGameClients: context.findingGameClients.length
      })
    })
  })

  return io
}
