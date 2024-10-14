const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const schemaBase = require('./DB');
const config = require('./configs');
const { cacheHelper } = require('./helpers');

const app = express();
app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors());

const init = async () => {
    await schemaBase.connect(config.mongoUri);
    global.models = schemaBase.init();
    await cacheHelper.connect();

    require('./routes')(app);

    const port = 3000;
    app.listen(port, () => {
        console.log(`server started on port ${port} 🚀`);
    });
};

init();
