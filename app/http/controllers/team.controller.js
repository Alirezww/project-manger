const autoBind = require("auto-bind");
const { TeamModel } = require("../../models/Team");

class TeamController {
    constructor() {
        autoBind(this)
    }

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

    async findTeam (teamID){
        const team = await TeamModel.findById(teamID);
        if(!team) throw { status : 400, message : "تیم مورد نظر پیدا نشد!!" };
        return team;
    }

    async getTeamById(req, res, next) {
        try{
            const teamID = req.params.id;
            const team = await this.findTeam(teamID)

            return res.status(200).json({
                status : 200,
                success : true,
                team
            });
        }catch(err){
            next(err)
        }
    }

    async removeTeamById(req, res, next) {
        try{
            const teamID = req.params.id;
            const team = await this.findTeam(teamID)

            const deletedTeam = await TeamModel.deleteOne({ _id : teamID });
            if(deletedTeam.deletedCount == 0) throw { status : 400, meesage : "حذف تیم با شکست مواجه شد." };

            return res.status(200).json({
                status : 200,
                success : true,
                message : "تیم مورد نظر با موفقیت حذف شد."
            });
        }catch(err){
            next(err)
        }
    }

    inviteUserToTeam() {

    }

    updateTeam(){

    }

    removeUserFromTeam(){
        
    }
}   

module.exports = {
    TeamController : new TeamController()
}