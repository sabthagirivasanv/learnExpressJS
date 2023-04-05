const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return req.sendStatus(401);
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);
        const result = req.roles.map(each => rolesArray.includes(each)).find(each => each === true);
        if(!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;