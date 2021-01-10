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
    const gameClient = context.game.clients.find(client => +client.sessionId === sessionId)

    if (gameClient) {
      console.log('return to the game here')
      context.game.updateClient(gameClient.sessionId, {
        socket: socket
      })
      context.game.updatePlayer(gameClient.sessionId, {
        socketId: socket.id,
        status: 'connected'
      })
      context.emit.toClient(sessionId, 'reconnect', context.game.getState())
    }

    // Max clients number passed, starting a game
    if (context.config.game.heroes.number === context.clients.length && !context.game._inited) {
      context.game.init(context.clients)
    }
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
        context.emit.global('game-start', context.game.players)
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
      }
    })
  })

  return io
}
