const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeeController');
const ROLES_LIST = require('../../config/userRoles');
const verifyRoles = require('../../middleware/VerifyRoles');



router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), employeeController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.postEmployee)


module.exports = router;