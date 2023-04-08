const mongoose = require('mongoose');

connectDB = async () => {
    try{
        await mongoose.connect(process.env.CLOUD === 'true'
            ? process.env.DATABASE_URI_CLOUD
            : process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    }catch (err){
        console.error(err);
    }
}

module.exports = connectDB;