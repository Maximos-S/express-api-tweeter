const jwt = require("jsonwebtoken")


const {
    jwtConfig
} = require("./config");
const bearerToken = require("express-bearer-token")
const {
    User
} = require("./db/models")
const {
    secret,
    expiresIn
} = jwtConfig;

const restoreUser = (req, res, next) => {
    const {
        token
    } = req;

    if (!token) {
        return res.set("WWW-Authenticate", "Bearer").status(401).end();
    }

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            err.status = 401;
            return next(err);
        }

        const {
            id
        } = jwtPayload.data;

        try {
            req.user = await User.findByPk(id);
        } catch (e) {
            return next(e);
        }

        if (!req.user) {
            return res.set("WWW-Authenticate", "Bearer").status(401).end();
        }

        return next();
    });
};



const requireAuth = [bearerToken(), restoreUser];





const getUserToken = (user) => {
    const userDataForToken = {
        id: user.id,
        email: user.email,
    }

    console.log("hey")

    const token = jwt.sign({
            data: userDataForToken
        },
        secret, {
            expiresIn: parseInt(expiresIn, 10)
        }
    );

    return token;
}

module.exports = {
    getUserToken,
    requireAuth
};