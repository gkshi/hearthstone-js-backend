module.exports = function (http, context) {
  const globalEmit = require('../helpers/emit.js')(context)

  const io = require('socket.io')(http, {
    cors: {
      origin: '*'
    }
  })

  io.use(function (socket, next) {
    // const handshakeData = socket.request
    // console.log('middleware:', handshakeData._query)
    console.log('<< middleware: socket.id', socket.id)
    context.clients.push(socket)

    // All clients are disconnected, resetting the game
    if (!context.clients.length) {
      context.game.reset()
    }

    // Max clients number passed, starting a game
    if (context.config.game.heroes.number === context.clients.length) {
      context.game.init()
    }
    next()
  })

  io.on('connection', socket => {
    console.log('<< connect socket.id', socket.id)

    socket.on('player-hero-pick', hero => {
      console.log('player-hero-pick', hero)
      context.game.players.push({
        socket: socket.id,
        hero
      })

      if (context.game.players.length === context.config.players.number) {
        globalEmit('game-start', context.game.players)
      }
    })

    socket.on('disconnect', () => {
      console.log('<< disconnected', socket.id)
      const i = context.clients.indexOf(socket)
      context.clients.splice(i, 1)
    })
  })

  return io
}
