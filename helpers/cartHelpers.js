var { CartDb } = require('../config/database')

module.exports = {

    addToCart: async (userId, product) => {
        return await new Promise(async (resolve, reject) => {
            let cart = await CartDb.findOne({ userId: userId }).exec()
                .catch(err => {
                    reject({ message: 'Error fetching cart' })
                })
            if (cart) {
                let itemIndex = cart.products.findIndex(p => p.id === product.id);
                if (itemIndex > -1) {
                    reject({ message: 'Item already added' })
                } else {
                    cart.products.push(product);
                    cart = await cart.save().catch(err => {
                        reject({ message: 'Error saving cart' })
                    })
                    resolve(cart);
                }
            } else {
                const newCart = await CartDb.create({ userId, product }).catch(err => {
                    reject({ message: 'Error creating cart' })
                });
                resolve(newCart);
            }
        })
    },

    getCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await CartDb.findOne({ userId: userId }).exec()
                .catch(err => {
                    reject({ message: err.message })
                })
            if (cart) {
                resolve(cart.products)
            } else {
                resolve([])
            }
        })
    },

    removeFromCart: () => {
        return new Promise(async (resolve, reject) => {

        })
    },

    clearCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            let data = await CartDb.deleteMany({ userId: userId }).exec()
                .catch(err => {
                    reject({ message: 'Database error' + err })
                })
            if (data) {
                resolve({ message: 'Success' })
            }
        })
    }

}