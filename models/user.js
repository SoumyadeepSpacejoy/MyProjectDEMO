const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs');
const { User } = models;

const generateHash = (password) => {
    return bcrypt.hashSync(password, 10);
};

const create = ({ name, email, password, phone }) => {
    const hashPassword = generateHash(password);
    return User.create({ name, email, password: hashPassword, phone });
};

const isExist = async (email) => {
    return User.countDocuments({ email });
};

const generateToken = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        return Promise.reject(new Error('incorrect email or password..'));
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return Promise.reject(new Error('incorrect email or password..'));
    }

    const today = new Date();
    const expires = new Date();
    expires.setDate(today.getDate() + 30);

    const tokenData = {
        id: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        expires: expires.getTime(),
    };

    return jwt.sign(tokenData, config.jwtSecret);
};

module.exports = {
    create,
    isExist,
    generateToken,
};
