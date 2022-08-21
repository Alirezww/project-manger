const { AuthController } = require('../http/controllers/auth.controller');
const { expressValidatorMapper } = require('../http/middlewares/checkErrors');
const { registerValidator } = require('../http/validations/auth');

const router = require('express').Router();

router.post("/register", registerValidator(), expressValidatorMapper ,AuthController.register)

module.exports = {
    authRoutes : router
}