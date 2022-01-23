var {ProductsDb} = require('../../config/database')

module.exports = {

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await ProductsDb.find()
            if (products) {
                resolve(products)
            }
            else {
                resolve({error: true, message: err.toString()})
            }
        })
    },

}