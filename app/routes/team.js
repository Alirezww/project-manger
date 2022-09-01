const router = require('express').Router()

const { checkLogin } = require('../http/middlewares/autoLogin');
const { TeamController } = require("../http/controllers/team.controller");
const { expressValidatorMapper } = require('../http/middlewares/checkErrors');
const { teamCreateValidator } = require('../http/validations/team');

router.post("/create", checkLogin,teamCreateValidator(), expressValidatorMapper, TeamController.createTeam);

router.get("/list", checkLogin, TeamController.getListOfTeams);

module.exports = {
    teamRoutes : router
}