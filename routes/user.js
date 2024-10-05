const router = require('express').Router();
const { user } = require('../controllers');

router.post('/create', user.createUser);
router.post('/signUpVerification', user.verifyUser);
router.post('/logIn', user.logIn);

module.exports = router;
