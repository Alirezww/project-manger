const { ProjectController } = require('../http/controllers/project.controller');
const { expressValidatorMapper } = require('../http/middlewares/checkErrors');
const { createProjectValidator } = require('../http/validations/project');
const { mongoIDValidator } = require('../http/validations/public');
const { checkLogin } = require('../http/middlewares/autoLogin');
const { uploadFile } = require('../modules/express-fileupload');
const fileUpload = require('express-fileupload');

const router = require('express').Router();

router.post("/create", fileUpload() ,checkLogin , createProjectValidator() , expressValidatorMapper, uploadFile,  ProjectController.createProject);

router.get("/list", checkLogin,ProjectController.getAllProject);

router.get("/:id", checkLogin, mongoIDValidator(), expressValidatorMapper ,ProjectController.getProjectById);

router.get("/remove/:id", checkLogin, mongoIDValidator(), expressValidatorMapper ,ProjectController.removeProject);

router.get("/edit/:id", checkLogin,ProjectController.updateProject);


module.exports = {
    projectRoutes : router 
} 