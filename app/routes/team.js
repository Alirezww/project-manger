const router = require('express').Router()

const { checkLogin } = require('../http/middlewares/autoLogin');
const { TeamController } = require("../http/controllers/team.controller");
const { expressValidatorMapper } = require('../http/middlewares/checkErrors');
const { teamCreateValidator } = require('../http/validations/team');
const { mongoIDValidator } = require('../http/validations/public');

router.post("/create", checkLogin,teamCreateValidator(), expressValidatorMapper, TeamController.createTeam);

router.get("/list", checkLogin, TeamController.getListOfTeams);

router.get("/:id", checkLogin, mongoIDValidator(), expressValidatorMapper , TeamController.getTeamById);

router.delete("/remove/:id", checkLogin, mongoIDValidator(), expressValidatorMapper ,TeamController.removeTeamById);

module.exports = {
    teamRoutes : router
}