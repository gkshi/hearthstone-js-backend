const playersNumber = 2

module.exports = {
  lobby: {
    players: {
      number: playersNumber
    }
  },

  game: {
    groups: {
      number: 3
    },
    heroes: {
      number: playersNumber,
      numberToPick: 2
    },
    deck: {
      copies: {
        default: 3,
        legendary: 3
      }
    }
  }
}
