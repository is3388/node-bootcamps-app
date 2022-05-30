const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    title: { 
                type: String,
                trim: true,
                required: [true, 'Please add a title for this review'],
                maxlength: 100
            },
    text: { 
                type: String,
                trim: true,
                required: [true, 'Please add some text']
            },
    rating: { 
                type: Number,
                min: 1,
                max: 10,
                required: [true, 'Please add a rating between 1 and 10']
            },
    createdAt: { 
                 type: Date,
                 default: Date.now
                },
    bootcamp: {
                type: mongoose.Schema.ObjectId,
                ref: 'Bootcamp',
                required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
}
    
})
// prevent user from submitting one review per bootcamp
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true})

// create a static method to get avg of course tuition of a specific bootcamp, store into db
ReviewSchema.statics.getAverageRating = async function(bootcampId) 
{
    //console.log('Calculating the average cost ...')
    //obj is an aggregated object and steps are inside the [] pipeline and this refers to current model
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        }, // match whatever pass in bootcamp field and use group operator to arrange result by criteria which is to get the Id and the averageCost
        {
            $group: { _id: '$bootcamp',
                  averageRating: { $avg: '$rating' }
                    }
        }
     ])
    //console.log(obj) // obj is an object in an array with id and averageCost
    try
    { // this.model(modelname) is to reference another model from this current model and update the avg cost for that bootcamp
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, 
        {
            averageRating: obj.length > 0 ? obj[0].averageRating : 0
        })
    }
    catch (err)
    {
        console.error(err)
    }
}

// Call getAverageRating after saving a rating
ReviewSchema.post('save', async function()
{
    await this.constructor.getAverageRating(this.bootcamp)
    })

// Call getAverageRating after removing a rating to get the updated avg rating
ReviewSchema.post('remove', async function()
{
    await this.constructor.getAverageRating(this.bootcamp)
}) 


module.exports = mongoose.model('Review', ReviewSchema)