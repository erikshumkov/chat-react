const users = []

const addUser = ({ id, nick, room }) => {
  const user = {
    id,
    nick,
    room
  }

  const userExist = users.find(check => check.nick === user.nick)

  if (userExist) return console.log("error, user already exist")

  users.push(user)

  return user
}

const getUser = (id) => {
  const userExist = users.find(check => check.id === id)

  return userExist
}

const removeUser = (id) => {
  const find = users.findIndex(user => user.id === id)

  if (find !== -1) return users.splice(find, 1)
}

module.exports = { users, addUser, removeUser, getUser }