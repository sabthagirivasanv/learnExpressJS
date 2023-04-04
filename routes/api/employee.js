const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeeController');


router.route('/')
    .get(employeeController.getAllEmployees)
    .post(employeeController.postEmployee)


module.exports = router;