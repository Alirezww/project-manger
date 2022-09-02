const router = require('express').Router()

const { checkLogin } = require('../http/middlewares/autoLogin');
const { TeamController } = require("../http/controllers/team.controller");
const { expressValidatorMapper } = require('../http/middlewares/checkErrors');
const { teamCreateValidator } = require('../http/validations/team');
const { mongoIDValidator } = require('../http/validations/public');

router.post("/create", checkLogin,teamCreateValidator(), expressValidatorMapper, TeamController.createTeam);

router.get("/list", checkLogin, TeamController.getListOfTeams);

router.get("/me", checkLogin, TeamController.getMyTeams);

router.delete("/remove/:id", checkLogin, mongoIDValidator(), expressValidatorMapper ,TeamController.removeTeamById);

router.get("/invite/:teamID/:username", checkLogin, TeamController.inviteUserToTeam);

router.put("/update/:teamID", checkLogin, TeamController.updateTeam);

router.get("/:id", checkLogin, mongoIDValidator(), expressValidatorMapper , TeamController.getTeamById);

module.exports = {
    teamRoutes : router
}