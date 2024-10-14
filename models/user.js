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

const decodeToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

const sendRequest = async (userId, reqId) => {
    const user = await User.findOne({ _id: userId }).select('friendRequestReceived');
    console.log('🚀 ~ sendRequest ~ user:', user);
    if (user.friendRequestReceived.includes(reqId)) {
        return Promise.reject(new Error('already in friend list'));
    }

    user.friendRequestReceived.push(reqId);
    return user.save();
};

const findOne = (userId) => {
    return User.findOne({ _id: userId }).select('-password').populate({
        path: 'friendRequestReceived friends',
        select: 'name',
    });
};

const acceptRequest = async (senderId, receiverId) => {
    const receiver = await User.findOne({ _id: receiverId });

    if (!receiver.friendRequestReceived || !receiver.friendRequestReceived.includes(senderId)) {
        return Promise.reject(new Error('no request found!!'));
    }

    const requestArray = receiver.friendRequestReceived.filter((id) => id.toString() !== senderId);
    receiver.friendRequestReceived = requestArray;
    receiver.friends.push(senderId);
    return receiver.save();
};

const updateFriendList = async (userId, friendId) => {
    const user = await User.findOne({ _id: userId }).select('friends');
    user.friends.push(friendId);
    return user.save();
};

const unfriend = async (userId, friendId) => {
    const user = await User.findOne({ _id: userId }).select('friends');
    console.log('🚀 ~ unfriend ~ user:', user);

    if (!user.friends.includes(friendId)) {
        return Promise.reject(new Error('not a friend!!'));
    }

    const frndArr = user.friends.filter((id) => id.toString() !== friendId);
    console.log('🚀 ~ unfriend ~ frndArr:', typeof frndArr);
    user.friends = frndArr;
    return user.save();
};

const updateUnFriendList = async (userId, friendId) => {
    const user = await User.findOne({ _id: userId }).select('friends');
    const frndArr = user.friends.map((id) => id.toString() !== friendId);
    console.log('🚀 ~ updateUnFriendList ~ frndArr:', frndArr);
    user.friends = frndArr;
    return user.save();
};

module.exports = {
    create,
    isExist,
    generateToken,
    decodeToken,
    sendRequest,
    findOne,
    acceptRequest,
    updateFriendList,
    unfriend,
    updateUnFriendList,
};
