const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user.role)
            return res.status(401).send();

        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.user.role);

        if(!result)
            return res.status(401).send();

        next();
    }
};

module.exports = verifyRoles;