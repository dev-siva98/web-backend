const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')


const productSchema = mongoose.Schema({
    pname: {
        type : String,
        required: true
    },
    weight: {
        type : String,
        required: true
    },
    pcode: String,
    price: {
        type : String,
        required: true
    },
    image: {
        type : String,
        required: true
    },
    id: {
        type : String,
        index: true,
        unique: true,
        required: true
    }
})

productSchema.plugin(uniqueValidator)

module.exports = mongoose.model('product', productSchema)