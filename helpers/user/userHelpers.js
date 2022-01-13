var { UsersDb } = require('../../config/database')
const bcrypt = require('bcrypt')


module.exports = {

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
                            resolve(err.message)
                        }
                        else {
                            resolve({ status: true, data })
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
                        resolve({ status: true, user })
                    } else {
                        console.log('Login Failed');
                        resolve({ status: false, message: 'Login Failed' })
                    }
                })
            } else {
                console.log('No User Found');
                resolve({ status: false, message: 'No user found' })
            }
        })
    },



}