const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')



const productSchema = mongoose.Schema({
    pname: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    pcode: String,
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    id: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    createdAt: {
        type : Date,
        default: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
          })
    }
})

const userSchema = mongoose.Schema({
    name: String,
    mobile: String,
    password: String,
    id: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    createdAt: {
        type : Date,
        default: Date.now
    }
})

const orderSchema = mongoose.Schema({
    user: String,
    total: String,
    orderStatus: String,
    items: Array,
    id: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    createdAt: {
        type : Date,
        default: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
          })
    }
})



productSchema.plugin(uniqueValidator)

const ProductsDb = mongoose.model('product', productSchema)
const UsersDb = mongoose.model('user', userSchema)
const OrderDb = mongoose.model('order', orderSchema)

module.exports = { ProductsDb, UsersDb, OrderDb }