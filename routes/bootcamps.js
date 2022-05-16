const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:'Show all bootcamps'})
})

router.post('/', (req, res) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:'Create bootcamp'})
})

router.get('/:id', (req, res) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:`Get a bootcamp for ${req.params.id}`})
})

router.put('/:id', (req, res) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:`Update a bootcamp for ${req.params.id}`})
})

router.delete('/:id', (req, res) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:`Delete a bootcamp for ${req.params.id}`})
})

module.exports = router