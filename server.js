const app = require("express")()
const options = {
  cors: true,
  origins: ["http://localhost:5000"]
}
const http = require("http").createServer(app)
const io = require("socket.io")(http, options)
const cors = require("cors")
const port = process.env.PORT || 5000
const { addUser, users, removeUser, getUser } = require("./users")

// middleware
app.use(cors())
app.use("/", require("./router"))

const messages = []

io.on("connection", (socket) => {

  socket.on("joinChat", ({ nick, room }) => {
    socket.nickname = nick
    socket.roomName = room

    const user = {
      id: socket.id,
      nick,
      room
    }

    addUser(user)

    socket.join(room)

    console.log(`${nick} just connected to the room ${room}. 🔥🔥🔥`)

    io.in(socket.roomName).emit("updateUserList", { users, user })

    socket.to(room).emit("newUserConnected", "New user in the room..")
  })

  socket.on("chatMessage", ({ msg, id }, callback) => {
    const user = getUser(id)

    messages.push({ id: socket.id, msg, nick: socket.nickname, room: socket.roomName })

    io.in(socket.roomName).emit("groupChat", { msg, user, messages })

    io.in(socket.roomName).emit("updateChat", messages)

    callback()
  })

  socket.on("typing", () => {
    socket.emit("userTyping")
  })

  socket.on("disconnect", () => {
    console.log(`${socket.nickname} just left the room.. 🙁`)

    removeUser(socket.id)

    socket.to(socket.roomName).emit("userDisconnected", { id: socket.id })
  })
})

http.listen(port, () => {
  console.log(`Listening on PORT: ${port}`)
})
