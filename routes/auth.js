require('dotenv').config()
const jwt = require('jsonwebtoken')


function auth(req, res, next) {
    const authHeader = req.header('Authorization')
    if (!authHeader) console.log('No token , Not authorized');

    const token=authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("" + err)
            req.authenticated = false
            req.user = null
        } else {
            console.log('Authenticated')
            req.authenticated = true
            req.user = decoded
        }
    })
    next()
}

module.exports = auth