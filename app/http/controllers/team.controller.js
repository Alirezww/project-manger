const { TeamModel } = require("../../models/Team");

class TeamController {

    async createTeam(req, res, next) {
        try{
            const {name, description,username} = req.body;
            const leader = req.user._id

            const team = TeamModel.create({
                name, username, description, leader
            })
            if(!team) throw { status : 500, message : "تیم مورد نظر ایجاد نشد." }
            return res.status(201).json({
                status : 201,
                success : true,
                message : "ایجاد تیم با موفقیت انجام شد."
            })
        }catch(err){
            next(err)
        }
    }

    async getListOfTeams(req, res, next) {
        try{
            const teams = await TeamModel.find({  });
            return res.status(200).json({
                status : 200,
                success : true,
                teams
            })
        }catch(err){
            next(err)
        }
    }

    inviteUserToTeam() {

    }

    removeTeamById() {

    }

    updateTeam(){

    }

    removeUserFromTeam(){
        
    }
}   

module.exports = {
    TeamController : new TeamController()
}