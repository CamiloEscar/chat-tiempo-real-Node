const express = require("express") // va a requerir express
const app = express()               //crea una constante igual al constructor o a la funcion principal para poder hacer las configuraciones
const http = require("http")        //crear un objeto http es igual a requerir el modulo http
const cors = require("cors")        //necesitamos habilitar las peticiones desde servidores diferentes, desde el front al back
const {Server} = require("socket.io") 

// hay q decirle a la aplicacion de expres que vamos a necesitar usar los cors
app.use(cors()) //habilitar cors

//creamos una constante va apermirir mediante http crear un servidor
const server = http.createServer(app) //creamos un servidor con el metodo createServer de http y
//le pasamos la constante app que es la aplicacion de express

//vamos a crear una constante io, igualamos server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",    //es el puerto del front
        methods: ["GET", "POST"]            //usa metodo get y post asi no se usa para eliminar o modificar
    }
})

io.on("connection",(socket) => {
    console.log(`Usuario actual: ${socket.id}`)     //imprime internamente 

    socket.on("join_room", (data) => {
        socket.join(data)                           //cuando se une a una sala
        console.log(`Usuario con id: ${socket.id} se unio a la sala: ${data}`)     //imprime internamente 

    })
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    })     

    socket.on("disconnect", () => {
        console.log("usuario desconectado", socket.id) //me tira en consola cuando actualiza, el usuario se desconecta
    })
})

//esto va a permir escuchar el servidor va a escuchar en el puerto 3000
//el metodo listen recibe dos parametros, el puerto y una funcion callback
server.listen(3001, () => {
    console.log("Server running on port 3001")
})