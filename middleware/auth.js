const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next) {
    // get token from header
    const token = req.header('x-auth-token') // key to the token

    // check if NOT token
    if(!token) {
        return res.status(401).json({ mgs: 'No token, authorization denied!' })
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))

        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Token is NOT valid!' })
    }
}