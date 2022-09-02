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
                name, username, description, leader, users : leader
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
            const teams = await TeamModel.aggregate([
              {
                $lookup : {
                  from : "users",
                  localField : "users",
                  foreignField : "_id",
                  as : "users"
                }
              },
              {
                $lookup : {
                  from : "users",
                  localField : "leader",
                  foreignField : "_id",
                  as : "leader"
                }
              },
              {
                $unwind : "$leader"
              }
            ]);
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
            const teams = await TeamModel.aggregate([
              {
                $match : { 
                  $or: [{ leader: userID }, { users: userID }]
                }
              },
              {
                $lookup : {
                  from : "users",
                  localField : "leader",
                  foreignField : "_id",
                  as : "leader"
                }
              },
              {
                $lookup : {
                  from : "users",
                  localField : "users",
                  foreignField : "_id",
                  as : "users"
                }
              },
              {
                $project : {
                  "leader.roles" : 0,
                  "leader.password" : 0,
                  "leader.token" : 0,
                  "leader.skills" : 0,
                  "leader.teams" : 0,
                  "leader.inviteRequests" : 0
                }
              },
              {
                $unwind : "$leader"
              }
            ])

            return res.status(200).json({
                status : 200,
                success : true,
                teams
            })

        }catch(err){
            next(err)
        }
    }

    async updateTeam(req, res, next){
      try{
          const data = req.body;
          const fields = ['name', 'description'];
          let badValue = ["", " ", null, undefined, NaN, 0, -1, {}, []];

          Object.entries(data).forEach(([key, value]) => {
            if(!fields.includes(key)) delete data[key];
            if(badValue.includes(value)) delete data[key]
          });

          const leader = req.user._id;
          const { teamID } = req.params
          const team = await TeamModel.findOne({ leader, _id : teamID });
          if(!team) throw { status : 404, message : "تیم مورد نظر یافت نشد." };

          const updateResult = await TeamModel.updateOne(
            { _id: teamID, leader },
            { $set: data }
          );
          if(updateResult.modifiedCount == 0) throw { status : 500, message : "ویرایش تیم با مشکل مواحه شد." };

          return res.status(200).json({
            status : 200,
            success : false,
            message : "تیم مورد نظر با موفقیت ویرایش شد."
          })

      }catch(err){
        next(err);
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

    removeUserFromTeam(){
        
    }
}   

module.exports = {
    TeamController : new TeamController()
}