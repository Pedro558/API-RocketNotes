require('dotenv/config')
require('express-async-errors');
const AppError = require('./utils/AppError');
const migrationsRun = require('./database/migrations')
const cors = require('cors')

const uploadConfig = require('./configs/upload')

const express = require('express')
const routes = require('./routes');

const app = express()
app.use(cors())
app.use(express.json())

app.use('/', routes)
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

//migrationsRun()

app.use((error, req, res, next) =>{
  // check if the error is from the user
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      message: error.message,
      status: "error"
    })
  }

   // console.error to debug in future
   console.error(error)

   // in the case an error occurs in the server-side
   return res.status(500).json({
    message: "Internal server error",
    status: "error"
   })
})

const PORT = process.env.PORT || 3333

app.listen(PORT, ()=>{
  console.log(`Server is listening on port ${PORT}`);
})