const User = require('../model/User');
const bcrypt = require('bcrypt');


const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) {
        return res.status(400).json({'message': 'Username and password required...'});
    }
    const duplicate = await User.findOne({username: user}).exec();
    if (duplicate) {
        return res.status(409).json({'message': 'Username already exists...'});
    }
    try{
        //encrypt the password:
        const encryptedPwd = await bcrypt.hash(pwd, 10);

        //create and store user into mongo collection:
        const newUser = await User.create({"username": user,
            "password": encryptedPwd
        });

        console.log(newUser);
        res.status(201).json({'message':`New user ${user} has been created`});

    }catch (err) {
        res.status(500).json({'message': err.message});
    }
};


module.exports = {handleNewUser};