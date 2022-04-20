var { OrderDb } = require('../config/database')

module.exports = {

    getAllOrders: (start, limit, field, sortOrder) => {
        return new Promise(async (resolve, reject) => {
            let orders = await OrderDb.find().limit(limit).skip(start).sort({ [field]: sortOrder }).exec()
            if (orders) {
                let count = await OrderDb.countDocuments()
                resolve({ orders, count })
            }
            else {
                resolve({ status: true, message: err.toString() })
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

}