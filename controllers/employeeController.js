const data = {};
data.employees = require('../model/employees.json');

const getAllEmployees = (req, res) => {
    res.json(data.employees);
}

const postEmployee = (req, res) => {
    res.json({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName
    })
}


module.exports = {getAllEmployees, postEmployee};