const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    Name:{
        type: String,
    },
    Price:{
        type: String,
    },
    Quantity:{
        type: String,
    }
})

module.exports = mongoose.model('order',OrderSchema)