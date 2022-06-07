const { OrderDb } = require('../config/database')
const Razorpay = require('razorpay')
const crypto = require('crypto')
require('dotenv').config()


var instance = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET })


module.exports = {

    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            let orders = await OrderDb.find()
            if (orders) {
                resolve(orders)
            }
            else {
                reject({ status: true, message: err.message })
            }
        })
    },

    createOrder: (userId, order) => {
        var ds = (new Date()).getTime().toString()
        order.userId = userId
        if (order.paymentMode === 'cod') {
            order.orderStatus = 'Placed'
            order.orderId = 'MCPC' + ds
            order.paymentStatus = 'cod'
        } else {
            order.orderStatus = 'Pending'
            order.orderId = 'MCPP' + ds
            order.paymentStatus = 'Pending'
        }
        order.id = order.orderId
        return new Promise((resolve, reject) => {
            OrderDb.create(order, (err, data) => {
                if (err) {
                    reject({ status: true, message: 'Error creating order' })
                }
                else {
                    resolve(data)
                }
            })
        })
    },

    doPayment: (order) => {
        return new Promise((resolve, reject) => {
            instance.orders.create({
                amount: order.total * 100,
                currency: "INR",
                receipt: order.orderId,
            }).then(res => {
                resolve(res)
            }).catch(err => {
                console.log('Error inside ', err)
            })
        })
    },

    verifyPayment: ({ payment, order }) => {
        return new Promise(async (resolve, reject) => {
            let fetch = await OrderDb.findOne({ orderId: order.receipt })
            if (fetch) {
                fetch.razorpay_payment_id = payment.razorpay_payment_id
                fetch.razorpay_order_id = payment.razorpay_order_id
                fetch.razorpay_signature = payment.razorpay_signature
                fetch = await fetch.save()
                const hmac = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET).update(fetch.razorpay_order_id + '|' + fetch.razorpay_payment_id).digest('hex')
                if (hmac === fetch.razorpay_signature) {
                    fetch.paymentStatus = 'Success'
                    fetch.orderStatus = 'Placed'
                    fetch = await fetch.save()
                    resolve(fetch)
                } else {
                    fetch.paymentStatus = 'Failed'
                    fetch = await fetch.save()
                    resolve(fetch)
                }
            } else {
                reject({ error: true, message: 'Order fetch error' })
            }
        })
    },

    failedPayment: ({ error, order }) => {
        return new Promise(async (resolve, reject) => {
            let fetch = await OrderDb.findOne({ orderId: order.receipt })
            if (fetch) {
                console.log('heyyy')

                fetch.razorpay_payment_id = error.metadata.razorpay_payment_id
                fetch.razorpay_order_id = error.metadata.razorpay_order_id
                fetch.paymentStatus = 'Failed'
                fetch = await fetch.save()
                resolve(fetch)
            } else {
                reject({ error: true, message: 'Order fetch error' })
            }
        })
    },

    capturePayment: ({ paymentId, order }) => {
        return new Promise((resolve, reject) => {
            instance.payments.capture(paymentId, order.amount, order.currency).then(res => {
                console.log(res)
                resolve(res)
            }).catch(err => {
                console.log(err)
            })
        })
    },

    getOrder: (userId) => {
        return new Promise(async (resolve, reject) => {
            let order = await OrderDb.find({userId: userId}).sort({createdAt: '-1'})
            if(order) {
                resolve(order)
            } else {
                reject({ error: true, message: 'Order fetch error' })
            }
        })
    },

    changeOrderStatus: ({orderId, value}) => {
        return new Promise( async (resolve, reject) => {
            let order = await OrderDb.findOne({orderId: orderId})
            if(order) {
                order.orderStatus = value
                order.save()
                resolve()
            } else {
                reject({error: true, message: 'Order fetch error'})
            }
        })
    }

}