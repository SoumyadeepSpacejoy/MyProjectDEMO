const user = require('./user');

module.exports = (app) => {
    app.get(`/`, (req, res) => {
        return res.status(200).json({ health: 'ok' });
    });

    app.use('/v1/user', user);
    console.log('route added... ✅');
};
