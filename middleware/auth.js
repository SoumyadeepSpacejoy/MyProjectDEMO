const { userModel } = require('../models');

const user = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) return res.status(400).json({ message: 'no token found' });

        const tokenData = userModel.decodeToken(token);

        if (tokenData.expires < new Date().getTime()) {
            return res.status(400).json({ message: 'Token expired' });
        } else {
            req.user = tokenData;
            next();
        }
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    user,
};
