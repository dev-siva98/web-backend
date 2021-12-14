var db = require('../config/database')
var objectId = require('mongoose').Types.ObjectId


module.exports = {
    getAllProducts: (start, limit,field, sortOrder) => {
        return new Promise(async(resolve, reject) => {
            let products= await db.find().limit(limit).skip(start).sort({[field]: sortOrder}).exec()
                if (products) {
                    let count= await db.countDocuments()
                    resolve({products,count})
                }
                else {
                    console.log('Error')
                }
        })
    },

    addProduct: (details) => {
        details.id="CC"+details.id
        return new Promise((resolve, reject) => {
            db.create(details,(err, data) => {
                if (err) {
                    console.log(err)
                }
                else {                   
                    resolve(details)
                }
            })
        })
    },

    getProduct: (proId) => {
        return new Promise((resolve, reject)=>{
            db.find({id:proId}, (err, data)=>{
                if (err) {
                    console.log(err)
                }
                else {          
                    console.log(data[0]);      
                    resolve(data[0])
                }
            })
        })
    }


}