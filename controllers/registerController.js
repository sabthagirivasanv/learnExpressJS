const path = require('path');
const fsPromises =require('fs').promises;
const bcrypt = require('bcrypt');

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (users){this.users = users;}
}

const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) {
        return res.status(400).json({'message': 'Username and password required...'});
    }
    const duplicate = usersDB.users.find(each => each.username === user);
    if (duplicate) {
        return res.status(409).json({'message': 'Username already exists...'});
    }
    try{
        //encrypt the password:
        const encryptedPwd = await bcrypt.hash(pwd, 10);
        const newUser = {"username": user,
            "password": encryptedPwd,
            "roles": {"User":2000}
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model','users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({'message':`New user ${user} has been created`});

    }catch (err) {
        res.status(500).json({'message': err.message});
    }
};


module.exports = {handleNewUser};