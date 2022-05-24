const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
                minlength: 8,
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



module.exports = mongoose.model('User', UserSchema)
