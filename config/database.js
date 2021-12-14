const mongoose = require('mongoose')

const instance = mongoose.Schema({
    pname: String,
    weight: String,
    pcode: String,
    price: String,
    image: {
        url: String,
        publicId: String
    },
    id: String
})
module.exports = mongoose.model('product', instance)