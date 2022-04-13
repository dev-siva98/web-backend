var { UsersDb, CartDb } = require('../config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


module.exports = {

    getUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await UsersDb.find({ id: userId }, { password: 0 }).exec()
                if (user) {
                    resolve(user)
                } else {
                    resolve({ error: true, message: 'Login to continue' })
                }
            } catch (err) {
                console.log(err)
                resolve({ error: true, message: 'Database error' })
            }
        })
    },

    addUser: (details) => {
        return new Promise((resolve, reject) => {
            UsersDb.create(details, (err, data) => {
                if (err) {
                    resolve({ status: true, message: err.toString() })
                }
                else {
                    resolve(details)
                }
            })
        })
    },

    sampleSignup: (userDetails) => {
        return new Promise(async (resolve, reject) => {

            userDetails.id = userDetails.mobile

            bcrypt.hash(userDetails.password, 10, (err, hash) => {
                if (err) {
                    resolve({ error: true, message: 'Problem with password' })
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

    doSignup: (userDetails) => {
        return new Promise(async (resolve, reject) => {
            userDetails.id = userDetails.mobile
            try {
                let user = await UsersDb.findOne({ id: userDetails.id }).exec()
                if (user) {
                    throw ({ message: 'User already exist' })
                } else {
                    bcrypt.hash(userDetails.password, 10, (err, hash) => {
                        if (err) {
                            throw ({ message: 'Problem with password' })
                        } else {
                            userDetails.password = hash

                            UsersDb.create(userDetails, (err, data) => {
                                if (err) {
                                    throw ({ message: err.message })
                                } else {
                                    const accessToken = jwt.sign({ id: data.id },
                                        process.env.ACCESS_TOKEN_SECRET,
                                        { expiresIn: 3600 }
                                    )
                                    resolve({ id: data.id, accessToken })
                                }
                            })
                        }
                    })
                }
            } catch (err) {
                resolve({ error: true, message: err })
            }
        })
    },

    doSignin: (userDetails) => {
        return new Promise(async (resolve, reject) => {
            let user = await UsersDb.findOne({ mobile: userDetails.mobile }).exec()
            if (user) {
                bcrypt.compare(userDetails.password, user.password).then((status) => {
                    if (status) {
                        const accessToken = jwt.sign({ id: user.id },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: 3600 }
                        )
                        resolve({ user: user, accessToken })
                    } else {
                        resolve({ error: true, message: 'Incorrect password' })
                    }
                })
            } else {
                resolve({ error: true, message: 'User not found' })
            }
        })
    },

    addToCart: (userId, product) => {
        return new Promise(async (resolve, reject) => {

            try {
                let cart = await CartDb.findOne({ userId: userId });

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
                    const newCart = await CartDb.create({ userId, product })
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
                let cart = await CartDb.findOne({ userId: userId }).exec()
                if (cart) {
                    resolve(cart)
                } else {
                    resolve([])
                }
            } catch (err) {
                resolve({ error: true, message: err.message })
            }
        })
    }


}