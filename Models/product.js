const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    Name:{
        type: String,
    },
    Category:{
        type: String,
    },
    Price:{
        type: String,
    },
    Stock:{
        type: String,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('product',ProductSchema)