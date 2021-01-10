require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env'
})

const main = require('express')()
const cookieParser = require('cookie-parser')
main.use(cookieParser())

const http = require('http').createServer(main)

// context
const context = {
  clients: [],
  config: require('../config')
}

const emit = require('../helpers/emit.js')(context)
context.emit = emit

const game = require('../game')(context)
context.game = game

main.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

// routes
main.get('/', (req, res) => {
  const data = {
    clients: context.clients.map(i => i.id),
    game: {
      clients: context.game.clients.map(i => ({ sessionId: i.sessionId, socket: i.socket.id })),
      players: context.game.players
    }
  }

  res.send(data)
})

// main.get('/test', (req, res) => {
//   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
//   // res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')
//   setTimeout(() => {
//     res.send({})
//   }, 5000)
// })

// socket
require('../socket')(http, context)

http.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`)
})

// context.game.init()
