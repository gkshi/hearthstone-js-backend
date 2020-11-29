module.exports = function (context) {
  return function (name, data) {
    console.log('globalEmit', name, data)
    context.clients.forEach(socket => {
      socket.emit(name, data)
    })
  }
}
