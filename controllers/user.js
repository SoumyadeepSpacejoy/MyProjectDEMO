const { Validator } = require('node-input-validator');
const { userModel, searchModel } = require('../models');
const { cacheHelper, randomHelper, mailHelper, validateHelper } = require('../helpers');

const createUser = async (req, res) => {
    try {
        const v = new Validator(req.body, {
            name: 'required|minLength:3|maxLength:20',
            email: 'required|email',
            password: 'required|minLength:8|maxLength:20',
            phone: 'required|minLength:10|maxLength:10',
        });

        const matched = await v.check();

        if (!matched) {
            return res.status(400).json({ message: 'unable to perform operation.', description: v.errors });
        }
        const { name, email, phone, password } = req.body;

        const isUserExist = await userModel.isExist(email);
        if (isUserExist) {
            return res.status(400).json({ message: 'Email already exist!!' });
        }

        const otp = randomHelper.generateOtp();
        await cacheHelper.set(`otp:${otp}`, { name, email, phone, password }, 60);

        mailHelper.send('SIGN UP VERIFICATION', email, otp);
        return res.status(200).json({ message: 'otp sent' });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { otp } = req.body;
        const key = `otp:${otp}`;
        const data = await cacheHelper.get(key);

        if (!data) {
            return res.status(400).json({ message: 'otp expired!!!' });
        }

        await userModel.create(data);
        res.status(200).json({ message: 'otp verified and user created...' });
        await cacheHelper.remove(key);
        return;
    } catch (e) {
        return res.status(400), json({ message: e.message });
    }
};

const logIn = async (req, res) => {
    try {
        const v = new Validator(req.body, {
            email: 'required|email',
            password: 'required|minLength:8|maxLength:20',
        });

        const matched = await v.check();

        if (!matched) {
            return res.status(400).json({ message: 'unable to perform operation.', description: v.errors });
        }
        const { email, password } = req.body;
        const token = await userModel.generateToken(email, password);
        return res.status(200).json({ token });
    } catch (e) {
        return res.status(401).json({ message: e.message });
    }
};

const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const { user } = req;
        if (userId === user.id) {
            return res.status(400).json({ message: 'own id received :(' });
        }
        await userModel.sendRequest(userId, user.id);
        return res.status(200).json({ message: 'Request sent' });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

const me = async (req, res) => {
    try {
        const { user } = req;
        const result = await userModel.findOne(user.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const { user } = req;
        const { accept } = req.params;

        await userModel.acceptRequest(user.id, accept);
        return res.status(200).json({ message: 'request accepted' });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

const unfriend = async (req, res) => {
    try {
        const { user } = req;
        const { friendId } = req.params;

        await userModel.unfriend(user.id, friendId);

        return res.status(200).json({ message: 'unfriend done' });
    } catch (e) {
        console.log('🚀 ~ unfriend ~ e:', e);
        return res.status(400).json({ message: e.message });
    }
};

const friendList = async (req, res) => {
    try {
        const { user } = req;
        const list = await userModel.getFriendList(user.id);
        return res.status(200).json(list);
    } catch (e) {
        console.log('🚀 ~ friendList ~ e:', e);
        return res.status(400).json({ message: e.message });
    }
};

const getFriendRequestList = async (req, res) => {
    try {
        const { user } = req;
        const list = await userModel.getFriendRequestList(user.id);
        return res.status(200).json(list);
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

const userSearch = async (req, res) => {
    try {
        const { limit, skip } = req.query;
        const { user } = req;
        const { search } = req.body;

        const users = await searchModel.search(search, user, skip, limit);
        return res.status(users.users.length !== 0 ? 200 : 400).json(users);
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    createUser,
    verifyUser,
    logIn,
    me,
    sendFriendRequest,
    acceptRequest,
    unfriend,
    friendList,
    getFriendRequestList,
    userSearch,
};
