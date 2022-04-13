var { ProductsDb } = require('../config/database')

module.exports = {

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            ProductsDb.find().exec((err, data) => {
                if (err) {
                    resolve({ error: true, message: err.message })
                } else {
                    resolve(data)
                }
            })
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