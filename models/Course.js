const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: { 
                type: String,
                trim: true,
                required: [true, 'Please enter a course title']
            },
    description: {
                    type: String,
                    required: [true, 'Please enter course description']            
                },
    weeks: {
                type: String,
                required: [true, 'Please enter number of weeks']            
                },
    tuition: {
                type: Number,
                required: [true, 'Please enter course tuition']            
                },
    minimumSkill: {
                    type: String,
                    required: [true, 'Please enter minimum skill'] ,
                    enum: ['beginner', 'intermediate', 'advanced']           
                },
    scholarshipAvailable: {
                            type: Boolean,
                            default: false           
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

// create a static method to get avg of course tuition of a specific bootcamp, store into db
CourseSchema.statics.getAverageCost = async function(bootcampId) 
{
    //console.log('Calculating the average cost ...')
    //obj is an aggregated object and steps are inside the [] pipeline and this refers to current model
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        }, // match whatever pass in bootcamp field and use group operator to arrange result by criteria which is to get the Id and the averageCost
        {
            $group: { _id: '$bootcamp',
                  averageCost: { $avg: '$tuition' }
                    }
        }
     ])
    //console.log(obj) // obj is an object in an array with id and averageCost
    try
    { // this.model(modelname) is to reference another model from this current model and update the avg cost for that bootcamp
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, 
        {
            averageCost: obj.length > 0 ? Math.ceil(obj[0].averageCost / 10) * 10 : 0
        })
    }
    catch (err)
    {
        console.error(err)
    }
}

// Call getAverageCost after saving a course
CourseSchema.post('save', async function()
{
    await this.constructor.getAverageCost(this.bootcamp)
    //const course = this // static method is run on model
    //await course.getAverageCost(this.bootcamp)
})

// Call getAverageCost after removing a course to get the updated avg cost
CourseSchema.post('remove', async function()
{
    await this.constructor.getAverageCost(this.bootcamp)
}) 

module.exports = mongoose.model('Course', CourseSchema)