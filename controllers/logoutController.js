const fsPromises = require('fs').promises;
const path = require('path');

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (users){this.users = users;}
}

const handleLogout = async (req, res) => {
    //on client, delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);//No content
    }
    const refreshToken = cookies.jwt;

    const existingUser = usersDB.users.find(each => each.refreshToken === refreshToken);
    if (!existingUser){
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }

    //Delete the refresh token from the database:
    const otherUsers = usersDB.users.filter(each => each.refreshToken !== existingUser.refreshToken);
    const currentUser = {...existingUser, refreshToken: ''}
    const allUsers = [...otherUsers, currentUser];
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(allUsers)
        );

    res.clearCookie('jwt', {httpOnly: true}); //secure: true - only serves on https
    res.sendStatus(204);

}

module.exports = {handleLogout};