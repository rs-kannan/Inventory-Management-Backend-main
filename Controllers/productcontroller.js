const ProductRouter = require('express').Router()
const Product = require('../Models/product')

ProductRouter.post('/createproduct', async (req,res) => {
    try{
        const item =new Product({
            Name: req.body.Name,
            Category: req.body.Category,
            Price: req.body.Price,
            Stock: req.body.Stock
        })
        const result = await item.save()
        res.json("Success")
    }
    catch (err) {
        res.json("Error in saving product")
    }
})

ProductRouter.get('/getproduct', async(req,res) => {
       const item = await Product.find().sort('-createdAt')
     try{
        res.json(item)
    }
    catch (err) {
        res.json(err)
    }
})

ProductRouter.get('/product/:id', async(req,res) => {
    const id = req.params.id
    try{
        const item = await Product.findById({_id: id})
        res.json(item)
    }
    catch(err){
        res.json(err)
    }
})

ProductRouter.put('/updateproduct/:id', async (req,res) => {
    const id = req.params.id
    try{
        const item = await Product.findByIdAndUpdate({_id:id},{
            Name: req.body.Name,
            Category: req.body.Category,
            Price: req.body.Price,
            Stock: req.body.Stock
        })
        res.json(item)
    }
    catch(err){
        res.json(err)
    }
})

ProductRouter.delete('/deleteproduct/:id', (req,res) => {
    const id = req.params.id
    try{
        Product.findByIdAndDelete({_id: id})
        .then(result => res.json("Deleted"))
        .catch(err  => res.json("Error"))
    }
    catch(err){
        res.json(err)
    }
})

ProductRouter.get('/productcount', async (req,res) => {
    try{
        const item = await Product.find().count()
        res.json(item)
    }
    catch(err){
        res.json(err)
    }
})

module.exports = ProductRouter