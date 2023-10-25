const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'Please add a name']
    },
    email:{
        type:String,
        require:[true,'Pleas add an email'],
        unique:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    role:{
        type:String,
        enum:['user','publisher','admin'],
        default:'user'
    },
    password:{
        type: String,
        require:[true,'Pleas add a password'],
        minlength:6,
        select:false

    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type:Date,
        default: Date.now
    }
})

//Encrypt password using bcrypt
UserSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)

})

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
    
}

UserSchema.methods.matchThePasswords =async  function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)

}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function(){
    // Generate token 
    const resetToken = crypto.randomBytes(20).toString('hex')

    //Hash token and set to ResetPasswordToken field

    this.resetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    //Set expire
    this.resetPasswordExpire = Date.now()+10*60*1000
    this.resetPasswordToken =resetToken

    return resetToken

}
module.exports = mongoose.model('User',UserSchema)