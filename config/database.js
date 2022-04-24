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
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
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
        default: Date.now()
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
            price: Number,
            image: String,
            id: String,
            createdAt: Date,
            quantity: Number
        }
    ],
    cartTotal: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

})

const orderSchema = mongoose.Schema({
    userId: String,
    userName: String,
    mobile: String,
    orderId: String,
    cartTotal: Number,
    couponApplied: String,
    discount: Number,
    shipping: Number,
    total: Number,
    paymentMode: String,
    orderStatus: String,
    paymentStatus: String,
    write: String,
    delivery: Date,
    razorpay_payment_id: String,
    razorpay_order_id: String,
    razorpay_signature: String,
    address: {
        address1: String,
        address2: String,
        landmark: String,
        pin: String,
        contact: String
    },
    products: [
        {
            pname: String,
            weight: String,
            proId: String,
            price: Number,
            image: String,
            id: String,
            createdAt: Date,
            quantity: Number
        }
    ],
    id: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})



productSchema.plugin(uniqueValidator)

const ProductsDb = mongoose.model('product', productSchema)
const UsersDb = mongoose.model('user', userSchema)
const CartDb = mongoose.model('cart', CartSchema)
const OrderDb = mongoose.model('order', orderSchema)

module.exports = { ProductsDb, UsersDb, CartDb, OrderDb }