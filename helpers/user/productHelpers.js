var { ProductsDb } = require('../../config/database')

module.exports = {

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            ProductsDb.find((err, data) => {
                if (err) {
                    resolve({ error: true, message: err.message })
                } else {
                    resolve(data)
                }
            })
        })
    },
}