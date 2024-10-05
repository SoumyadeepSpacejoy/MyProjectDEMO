const bcrypt = require('bcrypt');
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

module.exports = {
    create,
    isExist,
};
