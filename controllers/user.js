const { Validator } = require('node-input-validator');
const { userModel } = require('../models');
const { cacheHelper, randomHelper, mailHelper } = require('../helpers');

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
        return res.status(200).json({ message: 'otp verified and user created...' });
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
        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    createUser,
    verifyUser,
    logIn,
};
