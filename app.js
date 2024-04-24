const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const https = require('https');
/*
const singUp = require("./routes/SingUp");
const singIn = require("./routes/SingIn");
const edits = require("./routes/edits");
const pay = require("./routes/payments");
const secu = require("./routes/security");*/

const app = express();
/*
const privateKey = fs.readFileSync('clave-privada.pem', 'utf8');
const certificate = fs.readFileSync('certificado-autofirmado.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);*/

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
        "./routes/courses.js",
        "./routes/lessons.js",
        "./routes/quizzes.js",
        "./routes/certificate.js",
        "./routes/notification.js",
        "./routes/chat.js",
        "./routes/admin.js"
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
app.use("/api/courses", require("./routes/courses"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/certificates", require("./routes/certificate"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/chat/", require("./routes/chat"));
app.use("/api/admin", require("./routes/admin"));

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
/*
httpsServer.listen(4242, () => {
  console.log('Servidor HTTPS en ejecución en el puerto 4242');
});*/

const PORT = process.env.PORT || 4243;
app.listen(PORT, () => console.log("server up en", PORT));