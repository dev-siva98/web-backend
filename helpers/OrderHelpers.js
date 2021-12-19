var {OrderDb} =require('../config/database')

module.exports = {

    getAllOrders: (start, limit, field, sortOrder) => {
        return new Promise(async (resolve, reject) => {
            let orders = await OrderDb.find().limit(limit).skip(start).sort({ [field]: sortOrder }).exec()
            if (orders) {
                let count = await OrderDb.countDocuments()
                resolve({ orders, count })
            }
            else {
                resolve({status:true, message: err.toString()})
            }
        })
    },

    addOrder: (details) => {
        // details.id = details.id
        return new Promise((resolve, reject) => {
            OrderDb.create(details, (err, data) => {
                if (err) {
                    resolve({ status: true, message: err.toString() })
                }
                else {
                    resolve(details)
                }
            })
        })
    },

}