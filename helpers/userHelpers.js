var {UsersDb} = require('../config/database')

module.exports = {

    getAllUsers: (start, limit, field, sortOrder) => {
        return new Promise(async (resolve, reject) => {
            let users = await UsersDb.find().limit(limit).skip(start).sort({ [field]: sortOrder }).exec()
            if (users) {
                let count = await UsersDb.countDocuments()
                resolve({ users, count })
            }
            else {
                resolve({status:true, message: err.toString()})
            }
        })
    },

    addUser: (details) => {
        // details.id = details.id
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

}