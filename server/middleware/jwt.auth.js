const jwt = require('jsonwebtoken');
require('dotenv').config();


const accessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            aud: userId
        };
        const options = {
            issuer: "TASKMANAGER",
            expiresIn: '12h',
        };
        const secret = process.env.SECRET_ACCESS_TOKEN;
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}


const verifyAdmin = async (req, res, next) => {
    try {
        const headerToken = req.headers['authorization'];
        if (!headerToken || headerToken === undefined) {
            return res.status(401).json({ message: 'JWT token is required' });
        }
        const bearerToken = headerToken.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'jwt token is expired' })
            }
            req.user = user.aud;
            if (req.user.roleId.role === 'Admin') {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Only Admin is allowed.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const verifyEmployee = async (req, res, next) => {
    try {
        const headerToken = req.headers['authorization'];
        if (!headerToken || headerToken === undefined) {
            return res.status(401).json({ message: 'JWT token is required' });
        }
        const bearerToken = headerToken.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'jwt token is expired' })
            }
            req.user = user.aud;
            if (req.user.roleId.role === 'Employee') {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Only the authenciated users are allowed.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyUser = async (req, res, next) => {
    try {
        const headerToken = req.headers['authorization'];
        if (!headerToken || headerToken === undefined) {
            return res.status(401).json({ message: 'JWT token is required' });
        }
        const bearerToken = headerToken.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'jwt token is expired' })
            }
            req.user = user.aud;
            if (req.user.roleId.role === 'Employee' || req.user.roleId.role === 'Admin' || req.user.roleId.role === 'P.M' || req.user.roleId.role === 'CTO') {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Only the authenciated users are allowed.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { accessToken, verifyAdmin, verifyEmployee, verifyUser };