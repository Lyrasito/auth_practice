const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                name: "marie",
            }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "15s",
                issuer: "localhost:3000",
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) {
                    console.log(err)
                    return reject(createError.InternalServerError())
                }
                resolve(token);
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) {
            return next(createError.Unauthorized())
        }
        const authHeaders = req.headers['authorization']
        const bearerToken = authHeaders.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err) { 
                err.name === "JsonWebTokenError" ?  next(createError.Unauthorized()) : next(createError.Unauthorized(err.message))
            }
            req.payload = payload
            next();
        })
    },

    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                name: "marie",
            }
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: "1y",
                issuer: "localhost:3000",
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) {
                    
                    return reject(createError.InternalServerError())
                }
                resolve(token);
            })
        })
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if(err) {
                    return reject(createError.Unauthorized())
                }
                const userId = payload.aud;

                resolve(userId);
            })
        })
    }
}