const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')

const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors');
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')


const mongoSanitize = require('express-mongo-sanitize');
const colors = require('colors')
const errorHandler = require('./middleware/error')
const path = require('path')

// const logger = require('./middleware/logger')

dotenv.config({ path: './config/config.env' })
connectDB()
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())

//For security purposes
app.use(helmet());
app.use(xss())
app.use(mongoSanitize());
app.use(cors())

//Rate Limit


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    limit: 1000000,  // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7',  // Set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false,  // Disable the `X-RateL1imit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
})

app.use(apiLimiter)
app.use(hpp())

//File upload
app.use(fileupload())
// To remove data using these defaults:

//cookie Parser
app.use(cookieParser())
//Set Static folder
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const bootcamps = require('./routes/bootcamps');
const course = require('./routes/course')
const review = require('./routes/review')
const auth = require('./routes/auth')
const users = require('./routes/user')

app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/course', course)
app.use('/api/v1/review', review)
app.use('/api/v1/users', users)
app.use('/api/v1/auth', auth)

app.use(errorHandler)

const server = app.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}! server is working ${process.env.NODE_ENV} mode`.red.bold))
//Handle unhandledRejection  promis rejections    
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1))

})