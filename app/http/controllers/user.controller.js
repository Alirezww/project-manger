const { UserModel } = require("../../models/User");
const { TeamModel } = require("../../models/Team");
const { generateImageLink } = require("../../modules/functions")

class UserController {
    async getProfile(req, res, next) {
        try{
            const userID = req.user._id

            const user = await UserModel.aggregate([
                {
                    $match : { _id : userID }
                },
                {
                    $lookup : {
                        from : "teams",
                        localField : "teams",
                        foreignField : "_id",
                        as : "teams"
                    }
                }
            ])

            user[0].profile_image = user[0].profile_image ? generateImageLink(user[0].profile_image, req) : user[0].profile_image

            return res.status(200).json({
                status : 200,
                sucess : true,
                user : user?.[0]
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
            
            const requests = await UserModel.aggregate([
                {
                    $match : { _id : userID }
                }
                // {
                //     $lookup : {
                //         from : "users",
                //         localField : "inviteRequests.caller",
                //         foreignField : "username",
                //         as : "inviteRequests.caller"
                //     }
                // },
                // {
                //     $project : {
                //         "inviteRequests.caller.mobile" : 1,
                //         "inviteRequests.caller.email" : 1,
                //         "inviteRequests.caller.username" : 1
                //     }
                // },
                // {
                //     $unwind : "$inviteRequests.caller" 
                // }
            ])

            return res.status(200).json({
                success : true,
                status : 200,
                requests
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
     
    async addSkills(req, res, next){
        try{
            const userID = req.user._id;
            const { skills } = req.body

            const updateUserResult = await UserModel.updateOne({ _id : userID }, { $set : { skills : skills } });
            if(updateUserResult.modifiedCount == 0) throw { status : 500, message : "اضافه کردن مهارت ها به پروفایل با موفقیت انجام نشد." };

            return res.status(200).json({
                status : 200,
                success : true,
                message : "مهارت های وارد شده با موفقیت ثبت گردید."
            })
        }catch(err){
            next(err)
        }
    }

    async changeStatusRequest(req, res, next){
        try{
            const { requestID, status } = req.params;

            const requestedUser = await UserModel.findOne({ "inviteRequests._id" : requestID });
            if(!requestedUser) throw { status : 404, message : "درخواست دعوت یافت نشد." };

            const targetRequest = requestedUser.inviteRequests.find(item => item.id == requestID )
            if(targetRequest.status !== "pending") throw { status : 400, message : "درخواست موردنظر قبلا قبول یا پذیرفته شده است." };

            if(!['rejected','accepted'].includes(status)) throw { status : 400, message : "وضعیت درخواست وارد شده معتبر نمی باشد." };
            const updateResult = await UserModel.updateOne({ "inviteRequests._id" : requestID }, { 
                $set : { "inviteRequests.$.status" : status }
            })
            if(updateResult.modifiedCount == 0) throw { status : 500, message : "تغییر وضعیت درخواست انجام نشد." };

            if(status == "accepted") {
                const updateTeamResult = await TeamModel.updateOne({ _id : targetRequest.teamID }, { $push : { users : requestedUser._id } });
                if(updateTeamResult.modifiedCount == 0) throw { status : 500, message : "اضافه کردن شما به لیست کاربران تیم انجام نشد." };

                const updatedUserResult = await UserModel.updateOne({ _id : requestedUser._id }, { $push : { teams : targetRequest.teamID } });
                if(updatedUserResult.modifiedCount == 0) throw { status : 500, message : "ویرایش کاربر با موفقیت انجام نشد!" }
            }

            return res.status(200).json({
                status :200,
                success : true,
                message : "تغییر درخواست با موفقیت انجام شد."
            })

        }catch(err){
            next(err)
        }
    }
}

module.exports = {
    UserController : new UserController()
}