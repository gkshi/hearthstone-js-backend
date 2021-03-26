module.exports = function (context) {
  return {
    global (name, data) {
      console.log('emitGlobal', name, data)
      context.clients.forEach(client => {
        client.emit(name, data)
      })
    },

    toPlayers (name, data) {
      console.log('emitGlobal', name, data)
      context.game.clients.forEach(client => {
        client.socket.emit(name, data)
      })
    },

    toClient (client, name, data) {
      if (typeof client === 'number') {
        client = context.game.clients.find(i => i.sessionId === client)
      }
      console.log('emitClient', client.sessionId, name, data)
      client.socket.emit(name, data)
    }
  }
}
