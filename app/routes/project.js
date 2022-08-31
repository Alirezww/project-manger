const { ProjectController } = require('../http/controllers/project.controller');
const { expressValidatorMapper } = require('../http/middlewares/checkErrors');
const { createProjectValidator } = require('../http/validations/project');
const { checkLogin } = require('../http/middlewares/autoLogin');
const { uploadFile } = require('../modules/express-fileupload');
const fileUpload = require('express-fileupload');

const router = require('express').Router();

router.post("/create", fileUpload() ,checkLogin , createProjectValidator() , expressValidatorMapper, uploadFile,  ProjectController.createProject);

router.get("/list", ProjectController.getAllProject);

module.exports = {
    projectRoutes : router 
}