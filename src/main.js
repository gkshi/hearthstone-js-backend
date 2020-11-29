require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env'
})

const main = require('express')()
const http = require('http').createServer(main)
const context = {
  clients: [],
  config: require('../config')
}
const game = require('../game')(context)
context.game = game

main.get('/', (req, res) => {
  const data = { ...context }
  data.clients = data.clients.length
  res.send(data)
})

context.game.init()
console.log('все группы', context.game.sets.groups)
console.log('все герои', context.game.sets.heroes)

require('../socket')(http, context)

http.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`)
})
