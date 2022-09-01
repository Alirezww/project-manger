const { body } = require("express-validator");
const { TeamModel } = require("../../models/Team");

function teamCreateValidator () {
    return [
        body("name").isLength({ min : 5 }).withMessage("فیلد نام تیم نباید کمتر از 5 نویسه باشد. باشد."),
        body("description").notEmpty().withMessage("توضخیات تیم نباید خالی باشد."),
        body("username").custom(async(username) => {
            const usernameRegep = /^[a-z]+[a-z0-9\_\.]{3,}$/gim
            if(usernameRegep.test(username)){
                const team = await TeamModel.findOne({ username });
                if(team) throw "نام کاربری قبلا توسط تیم دیگری استفاده شده است.";
                return true;
            }
            throw "نام کاربری معتبر نمی باشد."
        })
    ]
}

// function inviteToTeamValidator () {
//     return [
//         param("teamID").custom(async(teamID, { req }) => {
//             const userID = req.user._id;
//             const team = await TeamModel.findOne({
//                 $or : [ { leader : userID }, { users : userID } ]
//                 , _id : teamID
//             })
//             if(!team) throw { status : 400, message : "تیمی جهت دعوت کردن افراد یافت نشد!!" };

//             return true;
//         }),

//         param("username").custom(async(username, ctx) => {
//             const user = await UserModel.findOne({ username });
//             if(!user) throw { status : 400, message : "کاربر موردنظر جهت دعوت به تیم یافت نشد!!" };

//             return true;
//         })
//     ]
// }

module.exports = {
    teamCreateValidator
}