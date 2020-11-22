// dotenv
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env'
})

// core
const app = require('express')()
const http = require('http').createServer(app)
const context = require('./context/index.ts')

app.get('/', (req, res) => {
  res.send({
    clients: context.clients.length,
    game: context.game
  })
})

require('./socket.ts')(http, context)

http.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`)
})
