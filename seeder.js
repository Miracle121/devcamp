const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

//Load models
const Bootcamp = require('./models/bootcamps')
const Course = require('./models/course')

//Connect to DB 

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useCreateIndex:true,
    // useFindAndModify:false
});

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
)
const course = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`)
)

//Import data into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(course)
        console.log('Data Imported...'.green.inverse);
        process.exit();

    } catch (err) {
        console.error(err);

    }
}
// Delete data

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        console.log('Data destroyed...'.red.inverse);
        process.exit()

    } catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === '-i') {
    importData()

} else if (process.argv[2] === '-d') {
    deleteData()
}