var {ProductsDb} = require('../../config/database')

module.exports = {

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await ProductsDb.find()
            if (products) {
                resolve(products)
            }
            else {
                resolve({status:true, message: err.toString()})
            }
        })
    },

}