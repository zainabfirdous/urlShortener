const express = require('express')
const cors = require('cors')
const {shorten} = require('./routes/shorten')
const {user} = require('./models/user')
const database = require("./config/db_config")

const app = express()

app.use(cors({
    origin:'*',
    methods:'GET, POST, PUT, DELETE'
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//setting routes based on api prefix
app.use('/api/shorten',shorten)

//function to ensure the db connection is established before starting the server
const startServer = async()=>{
  await database.testConnection();
  const port = 3000
  app.listen(port, (err)=>{
    if(err){
      console.log(`Error starting server: ${err}`)
    }
    console.log(`server is running on http://localhost:${port}`)
})
}

startServer();



