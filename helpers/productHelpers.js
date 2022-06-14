var { ProductsDb } = require('../config/database')

module.exports = {

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await ProductsDb.find()
            if (products) {
                resolve(products)
            } else {
                reject({ message: 'Empty' })
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
        return new Promise(async (resolve, reject) => {
            let product = await ProductsDb.findOne({ proId: proId })
            if (product) {
                resolve(product)
            }
            else {
                reject({ error: true, message: 'Not found' })
            }
        })
    },

    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            ProductsDb.deleteOne({ id: proId }, (err, data) => {
                if (err) {
                    reject({ error: true, message: err.toString() })
                }
                else {
                    resolve({ id: proId })
                }
            })
        })
    },

    updateProduct: (proId, details) => {
        return new Promise((resolve, reject) => {
            ProductsDb.findOneAndUpdate({ id: proId },
                details,
                (err, data) => {
                    if (err) {
                        resolve({ error: true, message: err.toString() })
                    }
                    else {
                        resolve({ id: proId })
                    }
                })
        })
    }
}