var { UsersDb, AdminDb } = require('../config/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


module.exports = {

    getUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            let user = await UsersDb.findOne({ id: userId }, { password: 0 }).exec()
            if (user) {
                resolve(user)
            } else {
                reject({ message: 'Login to continue' })
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

    doSignup: (userDetails) => {
        return new Promise(async (resolve, reject) => {
            userDetails.id = userDetails.mobile
            let user = await UsersDb.findOne({ id: userDetails.id }).exec()
            if (user) {
                reject({ message: 'User already exist' })
            } else {
                bcrypt.hash(userDetails.password, 10, (err, hash) => {
                    if (err) {
                        reject({ message: 'Problem with password' })
                    } else {
                        userDetails.password = hash

                        UsersDb.create(userDetails, (err, data) => {
                            if (err) {
                                reject({ message: err.message })
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
                        reject({ message: 'Incorrect password' })
                    }
                })
            } else {
                reject({ message: 'User not found' })
            }
        })
    },

    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await UsersDb.find({}, { password: 0 }).exec()
            if (users) {
                resolve(users)
            } else {
                reject({ error: true, message: 'Database error' })
            }
        })
    },
    getAdminData: () => {
        return new Promise(async (resolve, reject) => {
            let admin = await AdminDb.findOne({ adminId: 'admin' })
            if (admin) resolve(admin)
            else reject({ error: true, message: 'database error' })
        })
    }

}