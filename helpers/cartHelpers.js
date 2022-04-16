var { CartDb } = require('../config/database')

module.exports = {

    addToCart: async (userId, product) => {
        return await new Promise(async (resolve, reject) => {
            let cart = await CartDb.findOne({ userId: userId })
            if (cart) {
                let itemIndex = await cart.products.findIndex(p => p.proId === product.proId);
                if (itemIndex > -1) {
                    reject({ message: 'Item already added' })
                } else {
                    cart.products.push(product);
                    cart.cartTotal = cart.cartTotal + product.price
                    cart = await cart.save().catch(err => {
                        reject({ message: 'Error saving cart' })
                    })
                    resolve(cart);
                }
            } else {
                const newCart = await CartDb.create({ userId: userId, products: product, cartTotal: product.price }).catch(err => {
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
                resolve(cart)
            } else {
                resolve({ cartTotal: 0, products: [] })
            }
        })
    },

    removeFromCart: (userId, product) => {
        return new Promise(async (resolve, reject) => {
            let negative = product.quantity * product.price
            let cart = await CartDb.updateOne({ userId: userId }, { $pull: { products: { proId: product.proId } }, $inc: { cartTotal: -negative } })
            if (cart.acknowledged) {
                resolve(cart)
            } else {
                reject({ message: 'Error deleting' })
            }
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
    },

    quantityIncrement: (userId, product) => {
        return new Promise(async (resolve, reject) => {
            let cart = await CartDb.findOne({ userId: userId }).exec()
            if (cart) {
                let itemIndex = await cart.products.findIndex(item => item.proId === product.proId)
                cart.products[itemIndex].quantity++
                cart.cartTotal = cart.cartTotal + product.price
                cart = await cart.save()
                resolve(cart)
            } else {
                reject({ message: 'Cart not updated' })
            }
        })
    },

    quantityDecrement: (userId, product) => {
        return new Promise(async (resolve, reject) => {
            let cart = await CartDb.findOne({ userId: userId }).exec()
            if (cart) {
                let itemIndex = await cart.products.findIndex(item => item.proId === product.proId)
                cart.products[itemIndex].quantity--
                cart.cartTotal = cart.cartTotal - product.price
                cart = await cart.save()
                resolve(cart)
            } else {
                reject({ message: 'Cart not updated' })
            }
        })
    }

}