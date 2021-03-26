module.exports = function (context) {
  const Group = require('../game/models/group')

  function normalizeGroup (group) {
    if (!group) {
      return null
    }
    if (typeof group === 'string') {
      const realGroup = context.game.sets.groups.find(i => i.alias === group)
      return realGroup || new Group(group)
    }
    return group
  }

  return {
    normalizeGroup
  }
}
