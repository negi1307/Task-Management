const jwt = require('jsonwebtoken');
require('dotenv').config();

// Access Token
const accessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            _id: userId._id,
            role: userId.role
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

// Token for Admin verification
const verifyAdmin = async (req, res, next) => {
    try {
        const headerToken = req.headers['authorization'];
        if (!headerToken || headerToken === undefined) {
            return res.status(201).json({ message: 'JWT token is required' });
        }
        const bearerToken = headerToken.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(201).json({ message: 'JWT token is expired or invalid' });
            }
            const { _id, role } = decoded;
            req.user = { _id, role };

            if (req.user.role === 'Admin') {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Only Admin is allowed.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Token for Employee Verification
const verifyEmployee = async (req, res, next) => {
    try {
        const headerToken = req.headers['authorization'];
        if (!headerToken || headerToken === undefined) {
            return res.status(201).json({ message: 'JWT token is required' });
        }
        const bearerToken = headerToken.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(201).json({ message: 'JWT token is expired or invalid' });
            }
            const { _id, role } = decoded;
            req.user = { _id, role, };

            if (req.user.role === 'Employee') {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Only the authenticated Employees are allowed.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// token to verify the User
const verifyUser = async (req, res, next) => {
    try {
        const headerToken = req.headers['authorization'];
        if (!headerToken || headerToken === undefined) {
            return res.status(201).json({ message: 'JWT token is required' });
        }
        const bearerToken = headerToken.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
            if (err) {
                return res.status(201).json({ message: 'jwt token is expired' })
            }
            const { _id, role } = user;
            req.user = { _id, role, };

            if (req.user.role === 'Employee' || req.user.role === 'Admin' || req.user.role === 'PM' || req.user.role === 'CTO' || req.user.role === 'Testing') {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Only the authenciated users are allowed.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// token For Task Creators
const verifySeniority = async (req, res, next) => {
    try {
        const headerToken = req.headers['authorization'];
        if (!headerToken || headerToken === undefined) {
            return res.status(201).json({ message: 'JWT token is required' });
        }
        const bearerToken = headerToken.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
            if (err) {
                return res.status(201).json({ message: 'jwt token is expired' })
            }
            const { _id, role } = user;
            req.user = { _id, role, };

            if (req.user.role === 'Admin' || req.user.role === 'PM' || req.user.role === 'CTO', req.user.role === 'Testing') {
                next();
            } else {
                return res.status(403).json({ message: 'Access denied. Only the authenciated users are allowed.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { accessToken, verifyAdmin, verifyEmployee, verifyUser, verifySeniority };