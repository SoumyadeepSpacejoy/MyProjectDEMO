const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { Server } = require('socket.io');
const schemaBase = require('./DB');
const config = require('./configs');
const { cacheHelper, socketHelper } = require('./helpers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors());

const init = async () => {
    await schemaBase.connect(config.mongoUri);
    global.models = schemaBase.init();
    await cacheHelper.connect();

    require('./routes')(app);
    socketHelper.socketInit(io);

    const port = process.env.PORT;
    const env = process.env.NODE_ENV;
    server.listen(port, () => {
        console.log(`server started on ${env} port ${port} 🚀`);
    });
};

init();
