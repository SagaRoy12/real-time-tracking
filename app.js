const express = require("express")
const app = express()
const port = 3000
// socket setup
const http = require("http")
const socketio = require("socket.io")
const server = http.createServer(app)
const io = socketio(server)
// ejs setup
const path = require ('path')
app.set("view engine" , "ejs")
app.set(express.static(path.join(__dirname, "public")))

// io connection handeling
io.on("connection" , function(socket){
    console.log("connected")
})

app.get('/' , (req, res)=>{
    res.render('index')
})

server.listen(port , ()=>{                      // app is replced by server
    console.log(`the server is listening on ${port}`)
})