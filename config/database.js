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
    id: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    proId: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
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
        type: Date,
        default: Date.now
    }
})

const CartSchema = mongoose.Schema({
    userId: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    products: [
        {
            pname: String,
            weight: String,
            proId: String,
            price: String,
            image: String,
            id: String,
            createdAt: Date,
            quantity: Number
        }
    ]
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
        type: Date,
        default: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
        })
    }
})



productSchema.plugin(uniqueValidator)

const ProductsDb = mongoose.model('product', productSchema)
const UsersDb = mongoose.model('user', userSchema)
const CartDb = mongoose.model('cart', CartSchema)
const OrderDb = mongoose.model('order', orderSchema)

module.exports = { ProductsDb, UsersDb,CartDb, OrderDb }