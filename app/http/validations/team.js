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

module.exports = {
    teamCreateValidator
}