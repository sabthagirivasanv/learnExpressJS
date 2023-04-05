require('dotenv').config();
const express = require('express');
const {logger} = require('./middleware/logEvents');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 8080;
const verifyJWT = require('./middleware/verifyJWT');
const mongoose = require('mongoose');
connectDB = require('./config/dbConn');
const cookieParser = require('cookie-parser');

//connect MongoDB:
connectDB();


const app = express();

//custom middleware logger:
app.use(logger);

//third-party middleware for cross-origin resource sharing:
app.use(cors());

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use(cookieParser());

//serving static content in root directory:
app.use('/',express.static(path.join(__dirname)));

//configuring routes:
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


//API ROUTES:
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employee'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views','404.html'));
    }else if(req.accepts('json')){
        res.join({error: "404 not found"});
    }else{
        res.type('txt').send('404 not found');
    }
})

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => {console.log(`Started listening on port : ${PORT}`)});
})
