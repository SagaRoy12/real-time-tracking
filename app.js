const express = require("express")
const app = express()
const port = 3000 || process.env.PORT;
// socket setup
const http = require("http")
const socketio = require("socket.io")
const server = http.createServer(app)
const io = socketio(server)
// ejs setup
const path = require ('path')
app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname, "public")))

// io connection handeling
io.on("connection" , function(socket){
    socket.on("send-location" , function(data){     // handeling the front end 'send-location' event
        io.emit("received-location" , {id: socket.id , ...data})    // sending back all the data to all the users with io.emit front end
    })
    socket.on("disconnected" , function(){
        io.emit("user-disconnected" , socket.id)
    })
})

app.get('/' , (req, res)=>{
    res.render('index')
})

server.listen(port , ()=>{                      // app is replced by server
    console.log(`the server is listening on ${port}`)
})
