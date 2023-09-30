const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
/*
const singUp = require("./routes/SingUp");
const singIn = require("./routes/SingIn");
const edits = require("./routes/edits");
const pay = require("./routes/payments");
const secu = require("./routes/security");*/

const app = express();

const options = {
    swaggerDefinition: {
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentation for your API',
      },
    },
    apis: [
        './routes/SingUp.js',
        './routes/SingIn.js',
        './routes/edits.js',
        './routes/payments.js',
        './routes/security.js',
        "./routes/mubert.js",
        "./routes/tiktok.js",
        "./routes/IAsongs.js",
    ],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.use(express.static('public'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({limit: '10mb',  extended: false }));
/*app.use(singUp);
app.use(singIn);
app.use(edits);
app.use(pay);
app.use(secu);*/

app.use('/api/singup', require('./routes/SingUp'));
app.use('/api/singin', require('./routes/SingIn'));
app.use('/api/edits', require('./routes/edits'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/security', require('./routes/security'));
app.use("/api/Spotify", require("./routes/mubert.js"));
app.use("/api/tiktok", require("./routes/tiktok.js"));
app.use("/api/IAsongs/", require("./routes/IAsongs.js"));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

function getRouteFiles() {
    const routeDir = path.join(__dirname, 'routes');
    return fs.readdirSync(routeDir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(routeDir, file));
}

const PORT = process.env.PORT || 8282;
app.listen(PORT, () => console.log("server up en", PORT));