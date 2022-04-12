var {ProductsDb} = require('../../config/database')
var objectId = require('mongoose').Types.ObjectId


module.exports = {
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await ProductsDb.find().exec()
            if (products) {
                let count = await ProductsDb.countDocuments()
                resolve({ products, count })
            }
            else {
                resolve({error: true, message: err.toString()})
            }
        })
    },

    addProduct: (details) => {
        details.proId = "CC" + details.proId
        details.id = details.proId
        return new Promise((resolve, reject) => {
            ProductsDb.create(details, (err, data) => {
                if (err) {
                    console.log(err.message)
                    resolve({ error: true, message: err.message })
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
                    resolve({error: true, message: err.toString()})
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
                    resolve({error: true, message: err.toString()})
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
                    resolve({error: true, message: err.toString()})
                }
                else{
                    resolve({id:proId})
                }
            })
        })
    }


}