const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) {
        return res.status(400).json({'message': 'Username and password required...'});
    }
    const existingUser = await User.findOne({username: user}).exec();
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
            {expiresIn: '300s'});

        const refreshToken = jwt.sign(
            {"username": existingUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'});

        //updating the refresh token of the found user:
        existingUser.refreshToken = refreshToken;
        const result = await existingUser.save();

        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({accessToken});
        // res.status(200).json({"success":`user: ${user} has been verified`})
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};