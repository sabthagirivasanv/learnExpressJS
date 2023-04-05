const jwt = require('jsonwebtoken');

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (users){this.users = users;}
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;
    const existingUser = usersDB.users.find(each => each.refreshToken === refreshToken);
    if (!existingUser){
        return res.sendStatus(403);
    }


    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || decoded.username !== existingUser.username) return res.sendStatus(403);
            const roles = Object.values(existingUser.roles);
            const accessToken = jwt.sign(
                {"UserInfo": {
                            "username": decoded.username,
                            "roles": roles
                        }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '60s'});
                res.json({accessToken});
        });

}

module.exports = {handleRefreshToken};