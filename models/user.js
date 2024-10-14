const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs');
const { User, Friend } = models;

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

const decodeToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

const sendRequest = (recipient, requester) => {
    return Friend.create({ recipient, requester });
};

const acceptRequest = (recipient, requester) => {
    return Friend.updateOne({ recipient, requester }, { $set: { status: 'accepted' } });
};

const getFriendList = async (userId) => {
    const friends = await Friend.find({
        $or: [
            { requester: userId, status: 'accepted' },
            { recipient: userId, status: 'accepted' },
        ],
    }).populate('requester recipient', 'name email phone');

    return friends.map((frnd) => {
        return frnd.requester._id.toString() === userId
            ? {
                  _id: frnd.recipient._id,
                  name: frnd.recipient.name,
                  email: frnd.recipient.email,
                  phone: frnd.recipient.phone,
              }
            : {
                  _id: frnd.requester._id,
                  name: frnd.requester.name,
                  email: frnd.requester.email,
                  phone: frnd.requester.phone,
              };
    });
};

const getFriendRequestList = (userId) => {
    return Friend.find({ recipient: userId, status: 'requested' }).populate('requester recipient', 'name email phone');
};

const findOne = (userId) => {
    return User.findOne({ _id: userId }).select('-password');
};

const unfriend = (userId, friendId) => {
    return Friend.deleteOne({
        $or: [
            { requester: userId, recipient: friendId, status: 'accepted' },
            { requester: friendId, recipient: userId, status: 'accepted' },
        ],
    });
};

module.exports = {
    create,
    isExist,
    generateToken,
    decodeToken,
    sendRequest,
    acceptRequest,
    getFriendList,
    findOne,
    getFriendRequestList,
    unfriend,
};
