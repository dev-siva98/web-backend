const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')


const productSchema = mongoose.Schema({
    pname: String,
    weight: String,
    pcode: String,
    price: String,
    image: {
        url: String,
        publicId: String
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