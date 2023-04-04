const express = require('express');
const {logger} = require('./middleware/logEvents');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 8080;


const app = express();

//custom middleware logger:
app.use(logger);

//third-party middleware for cross-origin resource sharing:
app.use(cors());

app.use(express.urlencoded({extended:false}));

app.use(express.json());

//serving static cohtent in root directory:
app.use('/',express.static(path.join(__dirname)));
//serving static cohtent in subdirectory:
app.use('/subdir',express.static(path.join(__dirname)));


//configuring routes of root directory:
app.use('/', require('./routes/root'));

//configuring routes of subdirectories:
app.use('/subdir', require('./routes/subdir'));

//configuring routes of employee apis:
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

app.listen(PORT, () => {console.log(`Started listening on port : ${PORT}`)});