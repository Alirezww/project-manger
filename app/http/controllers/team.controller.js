const autoBind = require("auto-bind");
const { TeamModel } = require("../../models/Team");
const { UserModel } = require("../../models/User");

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
            await this.findTeam(teamID)

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

    async getMyTeams(req, res, next) {
        try{
            const userID = req.user._id;
            const teams = await TeamModel.find({ 
                $or: [{ leader: userID }, { users: userID }]
            })

            return res.status(200).json({
                status : 200,
                success : true,
                teams
            })

        }catch(err){
            next(err)
        }
    }

    async findUserInTeam(teamID, userID) {
        const result = await TeamModel.findOne({
          $or: [{ leader: userID }, { users: userID }],
          _id: teamID,
        });
        return !!result;
      }
      //http:anything.com/team/invite/:teamID/:username
      async inviteUserToTeam(req, res, next) {
        try {
          const userID = req.user._id;
          const { username, teamID } = req.params;
          const team = await this.findUserInTeam(teamID, userID);
          if (!team)
            throw { status: 400, message: "تیمی جهت دعوت کردن افراد یافت نشد" };
          const user = await UserModel.findOne({ username });
          if (!user)
            throw {
              status: 400,
              message: "کاربر مورد نظر جهت دعوت به تیم یافت نشد",
            };
          const userInvited = await this.findUserInTeam(teamID, user._id);
          if (userInvited)
            throw {
              status: 400,
              message: "کاربر مورد نظر قبلا به تیم دعوت شده است",
            };
          const request = {
            caller: req.user.username,
            requestDate: new Date(),
            teamID,
            status: "pending",
          };
          const updateUserResult = await UserModel.updateOne(
            { username },
            {
              $push: { inviteRequests: request },
            }
          );
          if (updateUserResult.modifiedCount == 0)
            throw { status: 500, message: "ثبت درخواست دعوت ثبت نشد" };
          return res.status(200).json({
            status: 200,
            success: true,
            message: "ثبت درخواست با موفقیت ایجاد شد",
          });
        } catch (error) {
          next(error);
        }
      }

    updateTeam(){

    }

    removeUserFromTeam(){
        
    }
}   

module.exports = {
    TeamController : new TeamController()
}