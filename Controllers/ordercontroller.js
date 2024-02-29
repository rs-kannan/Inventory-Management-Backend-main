const OrderRouter = require('express').Router()
const Order = require('../Models/order')

OrderRouter.post('/orderproduct', async (req,res) => {
    try{
        const order = new Order({
            Name: req.body.Name,
            Price: req.body.Price,
            Quantity: req.body.Quantity,
        })
        await order.save()
        res.json(order)
    }
    catch(err){
        res.json(err)
    }
})

OrderRouter.get('/getorders', async(req,res) => {
    try{
        const order = await Order.find()
        res.json(order)
    }
    catch(err){
        res.json(err)
    }
})

OrderRouter.get('/ordercount', async (req,res) => {
    try{
        const order = await Order.find().count()
        res.json(order)
    }
    catch(err){
        res.json(err)
    }
})

module.exports = OrderRouter