const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const allEmployees = await Employee.find().exec();
    if (!allEmployees) return res.status(204).json({'message':'No Employees Found..'});
    res.json(allEmployees);
}

const getEmployeeById = async (req, res) => {
    if (!req?.params?.id){
        return res.status(400).json({'message':'Id is required...'});
    }
    const existingEmployee = await Employee.findOne({_id: req.params.id}).exec();
    if(!existingEmployee) return res.status(404).json({'message':'No employee found with the given ID...'});
    res.json(existingEmployee);
}

const postEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req.body.lastname){
        return res.status(400).json({'message':'First and Last Names are required...'});
    }

    try{
        const dataFromClient = req.body;

        const newEmployee = new Employee();
        newEmployee.firstname = dataFromClient.firstname;
        newEmployee.lastname = dataFromClient.lastname;

        const result = await newEmployee.save();
        res.json(result);
    }catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id){
        return res.status(400).json({'message':'Id is required...'});
    }
    const existingEmployee = await Employee.findOne({_id: req.body.id}).exec();
    if (req.body?.firstname) existingEmployee.firstname = req.body.firstname;
    if (req.body?.lastname) existingEmployee.lastname = req.body.lastname;
    const result = await existingEmployee.save();
    return res.json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id){
        return res.status(400).json({'message':'Id is required...'});
    }
    const existingEmployee = await Employee.findOne({_id: req.body.id}).exec();
    if(!existingEmployee) return res.status(404).json({'message':'No employee found with the given ID...'});
    const result = await existingEmployee.deleteOne({_id: req.body.id});
    return res.json(result);
}


module.exports = {getAllEmployees, postEmployee, updateEmployee, deleteEmployee, getEmployeeById};