const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')

// const logger = require('./middleware/logger')

dotenv.config({ path: './config/config.env' })
connectDB()
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())
// app.use(logger)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const bootcamps = require('./routes/bootcamps');
app.use('/api/v1/bootcamps', bootcamps)
app.use(errorHandler)

const server = app.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}! server is working ${process.env.NODE_ENV} mode`.red.bold))

//Handle unhandledRejection  promis rejections    
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1))

})