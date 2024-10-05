const user = require('./user');

module.exports = (app) => {
    app.use('/v1/user', user);
    console.log('route added... ✅');
};
