const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


const moviesRouter = require('./routes/movies');
const authRouter = require('./routes/auth');

const app = express();
// app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views'))); // serving files statically from views folder
// app.set('views','./views');
// app.set('view engine','ejs');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods'
        , 'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.statusCode(200);
    }
    next();
})

app.use('/movies', moviesRouter);
app.use('/auth', authRouter);
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'documentation.html'))
})


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


const url = "mongodb+srv://Mina:gaa%40%40UxWiTw5hVg@minacluster-ykcse.mongodb.net/shop?authSource=admin&replicaSet=MinaCluster-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
mongoose
    .connect(
        url, { useNewUrlParser: true }
    )
    .then(result => {
        console.log('Client connected');
        app.listen(8080);
    })
    .catch(err => console.log(err));