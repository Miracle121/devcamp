const mongoose = require('mongoose')

const connectDB = async()=>{
   const connect = await mongoose.connect(process.env.MONGO_URI,{
   //  useNewUrlParser:true,
   //  useCreateIndex:true,
   //  useFindAndModify:false
   });
   console.log(`MongoDB Connected: ${connect.connection.host}`.green.underline.bold);
}
module.exports = connectDB