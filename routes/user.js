const router = require('express').Router();
const { user } = require('../controllers');
const { authMiddleware } = require('../middleware');

router.post('/create', user.createUser);
router.post('/signUpVerification', user.verifyUser);
router.post('/logIn', user.logIn);
router.get('/me', authMiddleware.user, user.me);
router.put('/sendRequest/:userId', authMiddleware.user, user.sendFriendRequest);
router.put('/acceptRequest/:accept', authMiddleware.user, user.acceptRequest);
router.put('/unfriend/:friendId', authMiddleware.user, user.unfriend);
router.get('/friendList', authMiddleware.user, user.friendList);
router.get('/requestList', authMiddleware.user, user.getFriendRequestList);
router.post('/search', authMiddleware.user, user.userSearch);

module.exports = router;
