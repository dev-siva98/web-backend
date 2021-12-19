var {ProductsDb} = require('../config/database')
var objectId = require('mongoose').Types.ObjectId


module.exports = {
    getAllProducts: (start, limit, field, sortOrder) => {
        return new Promise(async (resolve, reject) => {
            let products = await ProductsDb.find().limit(limit).skip(start).sort({ [field]: sortOrder }).exec()
            if (products) {
                let count = await ProductsDb.countDocuments()
                resolve({ products, count })
            }
            else {
                resolve({status:true, message: err.toString()})
            }
        })
    },

    addProduct: (details) => {
        details.id = "CC" + details.id
        return new Promise((resolve, reject) => {
            ProductsDb.create(details, (err, data) => {
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
            ProductsDb.find({ id: proId }, (err, data) => {
                if (err) {
                    resolve({status:true, message: err.toString()})
                }
                else {
                    resolve(data[0])
                }
            })
        })
    },

    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            ProductsDb.deleteOne({ id: proId }, (err, data) => {
                if (err) {
                    resolve({status:true, message: err.toString()})
                }
                else {
                    resolve({ id: proId })
                }
            })
        })
    },

    updateProduct: (proId, details) => {
        return new Promise((resolve, reject)=>{
            ProductsDb.findOneAndUpdate({id:proId},
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