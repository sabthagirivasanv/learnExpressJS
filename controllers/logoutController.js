const User = require('../model/User');

const handleLogout = async (req, res) => {
    //on client, delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);//No content
    }
    const refreshToken = cookies.jwt;

    const existingUser = await User.findOne({refreshToken}).exec();
    if (!existingUser){
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }

    //Delete the refresh token from the database:
    existingUser.refreshToken = '';
    const result = await existingUser.save();

    console.log(result);

    res.clearCookie('jwt', {httpOnly: true}); //secure: true - only serves on https
    res.sendStatus(204);

}

module.exports = {handleLogout};