const  express = require('express')
const dotenv = require('dotenv')

dotenv.config({path:'./config/config.env'})
const app = express()
const PORT = process.env.PORT || 3001

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => 
console.log(`Example app listening on port ${PORT}! server is working ${process.env.NODE_ENV} mode` ))