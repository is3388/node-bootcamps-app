// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) =>
{
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
    //res.status(400).json({success: false})
     res.status(200).json({success: true, msg:'Show all bootcamps'})
}

// @desc Create a new bootcamp
// @route POST /api/v1/bootcamps
// @access Private must be publisher or Admin
exports.createBootcamp = (req, res, next) =>
{
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
    //res.status(400).json({success: false})
    res.status(200).json({success: true, msg:'Create bootcamp'})
}

// @desc Get specific bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:`Get a bootcamp for ${req.params.id}`})
}

// @desc Update specific bootcamp
// @route PUT or PATCH /api/v1/bootcamps/:id
// @access Private must be publisher or Admin
exports.updateBootcamp = (req, res, next) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:`Update a bootcamp for ${req.params.id}`})
}

// @desc Delete specific bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private must be publisher or Admin
exports.deleteBootcamp = (req, res, next) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:`Delete a bootcamp for ${req.params.id}`})
}



