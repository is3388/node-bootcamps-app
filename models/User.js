const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto') // core module for generate token and hash it

const UserSchema = new mongoose.Schema({
    name: { 
            type: String,
            required: [true, 'Please add a name']
          },
    email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match:  [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
              ]
            }, 
    role: {
            type: String,
            enum: ['user', 'publisher'],
            default: 'user'
    },
    password: {
                type: String,
                required: [true, 'Please add a password'],
                minlength: 6,
                select: false
               },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { 
                type: Date,
                default: Date.now
                }
})

// encrypt password using bcryptjs
UserSchema.pre('save', async function(next)
{
    if(!this.isModified('password'))
    {
        next()
    }
    // generate salt
    const salt = await bcrypt.genSalt(10)
    // turn plain password into hash password
    this.password = await bcrypt.hash(this.password, salt)
    //const user = this
    // user.password = awiat bcrypt.hash(user.password, salt)
    next()
})

// sign JWT token and return it
UserSchema.methods.getSignedJwtToken = function()
{
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// compare user enteredpassword with password in database
UserSchema.methods.matchPassword = async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword, this.password)
}

// generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
   //randomBytes return buffer
    const resetToken = crypto.randomBytes(20).toString('hex')
    // hash token and set to database field resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // set expires in 10 mins
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    // return the plain token not hashed token
    return resetToken
} 

module.exports = mongoose.model('User', UserSchema)
