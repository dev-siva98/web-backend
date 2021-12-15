var db = require('../config/database')
var objectId = require('mongoose').Types.ObjectId


module.exports = {
    getAllProducts: (start, limit, field, sortOrder) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.find().limit(limit).skip(start).sort({ [field]: sortOrder }).exec()
            if (products) {
                let count = await db.countDocuments()
                resolve({ products, count })
            }
            else {
                console.log('Error')
            }
        })
    },

    addProduct: (details) => {
        details.id = "CC" + details.id
        return new Promise((resolve, reject) => {
            db.create(details, (err, data) => {
                if (err) {
                    resolve({ status: true, message: err.toString() })
                }
                else {
                    resolve(details)
                }
            })
        })
    },

    getProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.find({ id: proId }, (err, data) => {
                if (err) {
                    console.log("Hai*****" + err)
                }
                else {
                    resolve(data[0])
                }
            })
        })
    },

    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.deleteOne({ id: proId }, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    resolve({ id: proId })
                }
            })
        })
    },

    updateProduct: (proId, details) => {
        return new Promise((resolve, reject)=>{
            db.findOneAndUpdate({id:proId},
                details,
                (err, data)=>{
                if(err){
                    resolve({status:true, message: err.toString()})
                }
                else{
                    resolve({id:proId})
                }
            })
        })
    }


}