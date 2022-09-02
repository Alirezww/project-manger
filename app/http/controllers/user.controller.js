const { UserModel } = require("../../models/User")
const { generateImageLink } = require("../../modules/functions")

class UserController {
    getProfile(req, res, next) {
        try{
            const user = req.user

            user.profile_image = generateImageLink(user.profile_image, req);

            return res.status(200).json({
                status : 200,
                sucess : true,
                user
            })
        }catch(err){
            next(err)
        }
    }

    async editProfile(req, res, next){
        try{
            const userID = req.user?._id

            const data = req.body;
            let fields = ["first_name", "last_name", "skills"];
            let badValue = ["", " ", null, undefined, NaN, 0, -1, {}, []];

            Object.entries(data).forEach(([key, value]) => {
                if(!fields.includes(key)) delete data[key];
                if(badValue.includes(value)) delete data[key];
            });

            console.log(data);

            const result = await UserModel.updateOne({ _id : userID }, { $set : data } );
            if(result.modifiedCount > 0){
                return res.status(200).json({
                    status : 200,
                    success : true,
                    message : "پروفایل شما با موفقیت ویرایش شد."
                })
            }
            throw { status : 200, success : true, message : "پروفایل شما با موفقیت انجام نشد."}

        }catch(err){
            next(err)
        }
    }

    async uploadProfileImage(req, res, next){
        try{
            const userID = req.user._id

            if(Object.keys(req.file).length == 0) throw {status : 400, messsage: "لطفا یک تصویری را آپلود کنید."}
            const filePath = req.file?.path?.substring(7);

            const result = await UserModel.updateOne({ _id : userID }, { $set : { profile_image : filePath } });
            if(result.modifiedCount == 0) throw { status : 400, messsage: "بروزرسانی انجام نشد." }
            return res.json(
                { 
                    status : 200,
                    success : true, 
                    message : 'پروفایل شما با موفقیت بروزرسانی. شد.' 
                }
            )
        }catch(err){
            next(err)
        }
    }

    async getAllRequest(req, res, next){
        try{
            const userID = req.user._id;
            const { inviteRequests } = await UserModel.findById(userID, { inviteRequests : 1 });

            return res.status(200).json({
                success : true,
                status : 200,
                requests : inviteRequests || []
            })
        }catch(err){
            next(err)
        }
    }

    async getRequestsByStatus(req, res, next){
        try{
            const { status } = req.params;
            const userID = req.user._id;
            
            const requests = await UserModel.aggregate([
                {
                    $match : { _id : userID }
                },
                {
                    $project : {
                        inviteRequests : 1,
                        _id : 0,
                        inviteRequests : {
                            $filter : {
                                input : "$inviteRequests",
                                as : "request",
                                cond : {
                                    $eq : ["$$request.status", status]
                                }
                            }
                        }
                    }
                }
            ])

            return res.status(200).json({
                status : 200,
                success : true,
                requests : requests?.[0]?.inviteRequests
            })
        }catch(err){
            next(err);
        }
    }
     
    addSkills(){

    }

    editSkills(){

    }

    acceptInviteInTeam(){

    }

    rejectInviteInTeam(){

    }
}

module.exports = {
    UserController : new UserController()
}