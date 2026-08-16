//import all packages

// 1.loads .env file contents in to process .env
require("dotenv").config()

// 2. import express
const express = require("express")

// 3. import cors
const cors = require("cors")

//import routes in server
const routes = require(".//Router/allroutes")

// 4. create server using express package
const carServer = express()

require("./Config/dbconnection")

// 5. enable cors in server
carServer.use(cors())

// parse json into json content
carServer.use(express.json())

//use routes in server
carServer.use(routes)

//static
carServer.use("/uploads", express.static("./uploads"))

// 6. set up port number to run server in the browser
const PORT = process.env.PORT

// 7. start server to listen client request to the port / available server in the internet

carServer.listen(PORT, () => {
    console.log(`Server started running at port123- : ${PORT}`)
})

carServer.use((err, req, res, next) => {
    res.status(500).json(err.message)
})

carServer.get("/", (req, res) => {
    res.status(200).send('<h1>Welcome</h1>')
})
