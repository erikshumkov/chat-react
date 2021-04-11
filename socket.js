const socket = io => {
  io.on("connection", client => {
    console.log("New Client Connection")
  })
}

module.exports = socket