var { UsersDb, CartSchema } = require('../../config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


module.exports = {

    getUser: (userId) => {
        return new Promise((resolve, reject) => {
            UsersDb.find({ id: userId }, { password: 0 }).exec
        })
    },

    doSignup: (userDetails) => {
        return new Promise(async (resolve, reject) => {

            userDetails.id = userDetails.mobile

            bcrypt.hash(userDetails.password, 10, (err, hash) => {
                if (err) {
                    console.log(err)
                } else {
                    userDetails.password = hash
                    UsersDb.create(userDetails, (err, data) => {
                        if (err) {
                            resolve({ error: true, message: 'User already exist' })
                        }
                        else {
                            const accessToken = jwt.sign({ id: data.id },
                                process.env.ACCESS_TOKEN_SECRET,
                                { expiresIn: 3600 }
                            )
                            resolve({ id: data.id, accessToken })
                        }
                    })
                }
            });
        })
    },

    doSignin: (userDetails) => {
        return new Promise(async (resolve, reject) => {
            let user = await UsersDb.findOne({ mobile: userDetails.mobile })
            if (user) {
                bcrypt.compare(userDetails.password, user.password).then((status) => {
                    if (status) {
                        console.log('Login Success');
                        const accessToken = jwt.sign({ id: user.id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: 3600 }
                        )
                        resolve({ id: user.id, accessToken })
                    } else {
                        console.log('Login Failed');
                        resolve({ error: true, message: 'Login Failed' })
                    }
                })
            } else {
                console.log('No User Found');
                resolve({ error: true, message: 'No user found' })
            }
        })
    },

    addToCart: (userId, product) => {
        return new Promise(async (resolve, reject) => {

            try {
                let cart = await CartSchema.findOne({ userId: userId });

                if (cart) {
                    let itemIndex = cart.products.findIndex(p => p.pcode === product.pcode);

                    if (itemIndex > -1) {
                        let productItem = cart.products[itemIndex];
                        productItem.quantity++
                        cart.products[itemIndex] = productItem
                    } else {
                        cart.products.push(product)
                    }
                    cart = await cart.save()
                    resolve(cart)
                } else {
                    const newCart = await CartSchema.create({ userId, product })
                    resolve(newCart)
                }
            } catch (err) {
                console.log(err);
                resolve({ error: true, message: err.message })
            }
        })
    },

    getCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let cart = await CartSchema.findOne({ userId: userId }).exec()
                if (cart) {
                    resolve(cart)
                } else {
                    resolve([])
                }
            } catch (err) {
                console.log(err)
                resolve({ error: true, message: err.message })
            }
        })
    }


}