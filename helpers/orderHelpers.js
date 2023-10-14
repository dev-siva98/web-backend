const { OrdersDb, AdminDb } = require('../config/database')
const Razorpay = require('razorpay')
const crypto = require('crypto')
require('dotenv').config()


var instance = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET })

module.exports = {

    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            let orders = await OrdersDb.find()
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
            order.orderStatus = 'placed'
            order.orderId = 'MCPC' + ds
            order.paymentStatus = 'cod'
        } else {
            order.orderStatus = 'pending'
            order.orderId = 'MCPP' + ds
            order.paymentStatus = 'pending'
        }
        order.id = order.orderId
        return new Promise((resolve, reject) => {
            OrdersDb.create(order, (err, data) => {
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
            let fetch = await OrdersDb.findOne({ orderId: order.receipt })
            if (fetch) {
                fetch.razorpay_payment_id = payment.razorpay_payment_id
                fetch.razorpay_order_id = payment.razorpay_order_id
                fetch.razorpay_signature = payment.razorpay_signature
                fetch = await fetch.save()
                const hmac = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET).update(fetch.razorpay_order_id + '|' + fetch.razorpay_payment_id).digest('hex')
                if (hmac === fetch.razorpay_signature) {
                    fetch.paymentStatus = 'success'
                    fetch.orderStatus = 'placed'
                    fetch = await fetch.save()
                    let admin = await AdminDb.findOneAndUpdate(
                        { adminId: 'admin' },
                        {
                            $inc: { online: fetch.total, total: fetch.total }
                        })
                    resolve(fetch)
                } else {
                    fetch.paymentStatus = 'failed'
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
            let fetch = await OrdersDb.findOne({ orderId: order.receipt })
            if (fetch) {
                fetch.razorpay_payment_id = error.metadata.razorpay_payment_id
                fetch.razorpay_order_id = error.metadata.razorpay_order_id
                fetch.paymentStatus = 'failed'
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
            let order = await OrdersDb.find({ userId: userId }).sort({ createdAt: '-1' })
            if (order) {
                resolve(order)
            } else {
                reject({ error: true, message: 'Order fetch error' })
            }
        })
    },

    changeOrderStatus: ({ orderId, value, checked }) => {
        return new Promise(async (resolve, reject) => {
            let order = await OrdersDb.findOne({ orderId: orderId })
            if (order) {
                order.orderStatus = value

                //increment total amount when cod order delivered

                if (checked && order.paymentMode === 'cod') {
                    await AdminDb.findOneAndUpdate(
                        { adminId: 'admin' },
                        {
                            $inc: { cod: order.total, total: order.total }
                        })
                }

                //decrement total amount when cod order status changed back from delivered to any other only once

                else if (!checked && order.paymentMode === 'cod' && order.deliveryStatus) {
                    await AdminDb.findOneAndUpdate(
                        { adminId: 'admin' },
                        {
                            $inc: { cod: -order.total, total: -order.total }
                        })
                }
                order.deliveryStatus = checked //change delieveryStatus true or false as per the checked variable
                order.save()
                resolve()
            } else {
                reject({ error: true, message: 'Order fetch error' })
            }
        })
    }

}