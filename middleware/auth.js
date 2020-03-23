const jwt  = require("jsonwebtoken");
const db  = require('../config/db');
const config =  require("config");

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if(!token) {
        return res.status(401).json({ msg: "No token, authorization denied, please refresh a page" });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        db.query(`SELECT created, verified FROM users WHERE id = ${decoded.user.id}`, (err, result) => {
            if((Date.parse(result[0].created))/1000 > decoded.iat) {
               return res.status(401).json({ msg: 'Token is not valid' });
            }
            if(!result[0].verified) {
                return res.status(403).json( { msg: 'Email is not verified' } );
            }

            req.user = decoded.user;
            req.token = token;
            next();

        });
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }

}