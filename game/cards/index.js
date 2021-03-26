const cards = () => [
  {
    name: 'Аколит К\'Туна'
  },
  {
    name: 'Мурлок-волнолов',
    group: 'murlocs',
    on: {
      battleCry () {
        console.log('призвать мурлока 1.1')
      }
    }
  },
  {
    name: 'Драконоид-солдат',
    group: 'dragons',
    taunt: true,
    abilities: []
  }
]

module.exports = cards()
