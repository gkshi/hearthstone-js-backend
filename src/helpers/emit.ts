// module.exports = (name, data) => {
//   context.clients.forEach(socket => {
//     socket.emit(name, data)
//   })
// }

module.exports = function (context) {
  return (name, data) => {
    context.clients.forEach(socket => {
      socket.emit(name, data)
    })
  }
}
