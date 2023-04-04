const bcrypt = require('bcrypt');

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (users){this.users = users;}
}

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) {
        return res.status(400).json({'message': 'Username and password required...'});
    }
    const existingUser = usersDB.users.find(each => each.username === user);
    if (!existingUser){
        return res.sendStatus(401);
    }
    const passwordMatched = await bcrypt.compare(pwd, existingUser.password);
    if(passwordMatched){
        //Implement JWT
        res.status(200).json({"success":`user: ${user} has been verified`})
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};