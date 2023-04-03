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

app.use(express.static(path.join(__dirname)));
app.get('^/$|/index(.html)?',(req, res)=> {
    //res.sendFile('./views/index.html',{root: __dirname});
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.get('/new-page(.html)?',(req, res)=> {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})

app.get('/old-page(.html)?',(req, res)=> {
    //res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
    res.redirect(301,'/new-page');
})

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