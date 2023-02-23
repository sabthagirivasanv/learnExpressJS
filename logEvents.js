const {v4: uuid} = require('uuid');
const {format} = require('date-fns');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async function(message, fileName){
    const dateTime = `\n${format(new Date(), 'yyyy-mm-dd hh:mm:ss')}`;
    const log = `${dateTime}\t${uuid()}\t${message}`;
    console.log(log);
    try {
        await fsPromises.appendFile(path.join(__dirname,'logs',fileName), log);
    }catch (err){
        console.error(err);
    }
}


module.exports = logEvents;