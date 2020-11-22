module.exports = function (http, context) {
  const globalEmit = require('./helpers/emit.ts')(context)

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
    // console.log('clients', context.clients)
    console.log('context.game.config.players.number', context.game.config.players.number)
    console.log('context.clients.length', context.clients.length)
    if (context.game.config.players.number === context.clients.length) {
      context.game.init()
    }
    // checkRoom()
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

      if (context.game.players.length === context.game.config.players.number) {
        globalEmit('game-start', context.game.players)
      }
    })

    socket.on('disconnect', () => {
      console.log('<< disconnected', socket.id)
      const i = context.clients.indexOf(socket)
      context.clients.splice(i, 1)
      // console.log('clients', context.clients)
    })
  })

  return io
}
