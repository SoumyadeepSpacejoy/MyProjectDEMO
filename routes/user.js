const router = require('express').Router();
const { user } = require('../controllers');

router.post('/create', user.createUser);
router.post('/signUpVerification', user.verifyUser);

module.exports = router;
