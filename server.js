const log = require('./logEvents');
const EventEmitter = require('events');
const http = require('http');
const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

const PORT = process.env.PORT || 8080;
class Emitter extends EventEmitter{}
const myEmitter = new Emitter();
const serveFile = async function(filePath, contentType, response){
    try {
        const rawData = await fsPromises.readFile(filePath,
            !contentType.includes('image') ? 'utf-8':'');
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            {'Content-Type': contentType});
        response.end(contentType === 'application/json' ? JSON.stringify(data) : data);
    }catch (e) {
        console.log(e);
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`,'reqLog.txt');

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    //makes the .html not required for browser:
    if(!extension && req.url.slice(-1) !== '/') filePath += 'html';

    const isFileExist = fs.existsSync(filePath);

    if(isFileExist){
        serveFile(filePath, contentType, res);

    }else{
        //404
        switch (path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location':'/new-page.html'});
                res.end();
                break;
            default:
                //serve 404
                serveFile(path.join(__dirname, 'views','404.html'), 'text/html', res);
        }
    }

})

server.listen(PORT, () => {console.log(`Started listening on port : ${PORT}`)});
myEmitter.on('log', (msg, fileName) => log(msg, fileName));