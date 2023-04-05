const bcrypt = require('bcrypt');
const path = require('path');
const fsPromises = require('fs').promises;
const jwt = require('jsonwebtoken');

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
        const roles = Object.values(existingUser.roles);
        const accessToken = jwt.sign(
            {"UserInfo":
                        {
                            "username": existingUser.username,
                            "roles": roles
                        }
                    },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '60s'});

        const refreshToken = jwt.sign(
            {"username": existingUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'});

        //saving refresh token of current user with all other users.
        const otherUsers = usersDB.users.filter(each => each.username !== existingUser.username);
        const currentUser = {...existingUser, refreshToken};
        usersDB.setUsers([...otherUsers, currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users));

        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({accessToken});
        // res.status(200).json({"success":`user: ${user} has been verified`})
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};