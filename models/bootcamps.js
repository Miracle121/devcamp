const mongoose = require('mongoose')
const { default: slugify } = require('slugify')
const geocoder = require('../utils/geocoder')

const bootcampsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [500, 'Description can not be more than 500 characters']

    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlengt: [20, 'Phone number can not be more than 20 characters']
    },
    email: {
        type: String,
        ///^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'

        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        // Geo JSON point
        type: {
            type: String,
            enum: ['Point'],
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        zipcode: String,
        country: String,
        state:String,
        countryCode:String

    },
    careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Others'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more then 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
// Create bootcamp slug from the name
bootcampsSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next();
});
//Geocode & create locations
bootcampsSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address)
    
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
        state:loc[0].stateCode,
        countryCode:loc[0].countryCode
    }

    next()
})

//Cascade delete courses when a bootcamp is delete
bootcampsSchema.pre('deleteOne',async function (next) {
    try {
        console.log("SDFsdfsd");
        console.log(`Courses deleted from bootcamps ${this._id}`);
    
        await this.model('Courses').deleteMany({ bootcamp:this._id })
        next();
    } catch(err){
            console.log(err);
    }

  
    
});

// Reverse populate with virtuals
bootcampsSchema.virtual('courses',{
    ref:'Course',
    localField:'_id',
    foreignField:'bootcamp',
    justOne:false
})

module.exports = mongoose.model('Bootcamps', bootcampsSchema)