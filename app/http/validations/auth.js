const { body } = require("express-validator");
const { UserModel } = require("../../models/User");

function registerValidator() {
    return [
        body("username")
            .isLength({ min : 4, max : 25 })
            .withMessage('نام کاربری نباید بیشتر از 25 کاراکتر و کمتر از 4 کاراکتر باشد.')

            .custom(async(username) => {
                if(username){
                    const usernameRegex = /^[a-z]+[a-z0-9\_\.]{2,}/gi
                    if(usernameRegex.test(username)){
                        const user = await UserModel.findOne({ username });
                        if(user) throw "نام کاربری تکراری می باشد."
                        return true
                    }
                    throw "نام کاربری صحیح نمی باشد."
                }

                throw "نام کاربر نمی تواند خالی باشد."
            }),

        body("email")
            .notEmpty()
            .withMessage("وارد کردن فیلد ایمیل الزامی می باشد.")

            .isEmail()
            .withMessage("ایمیل وارد شده معتبر نمی باشد.")
            
            .custom(async(email) => {
                const user = await UserModel.findOne({ email });
                if(user) throw "ایمیل وارد شده قبلا استفاده شده است."
                return true
            }),

        body("mobile")
            .notEmpty()
            .withMessage("وارد کردن فیلد شماره موبایل الزامی می باشد.")

            .isMobilePhone("fa-IR")
            .withMessage("شماره موبایل وارد شده معتبر نمی باشد.")
            
            .custom(async(mobile) => {
                const user = await UserModel.findOne({ mobile });
                if(user) throw "شماره موبایل وارد شده قبلا استفاده شده است."
                return true
            }),

        body("password")
            .isLength({ min : 8, max : 18 })
            .withMessage('رمز عبور نباید بیشتر از 18 کاراکتر و کمتر از 8 کاراکتر باشد.')

            .custom((value, ctx) => {
                if(!value) throw "فیلد رمز عبور نمیتواند خالی باشد."
                if(value !== ctx?.req?.body?.confirm_password) throw "رمز و عبور و تکرار رمز عبور باید بایکدپیر همسان باشند.";
                return true
            })

    ]
}

function loginValidator(){
    return [
        body('username')
            .notEmpty().withMessage("نام کاربری نمی تواند خالی باشد.")

            .custom(async(username) => {
                if(username){
                    const usernameRegex = /^[a-z]+[a-z0-9\_\.]{2,}/gi
                    if(usernameRegex.test(username)){
                        return true
                    }
                    throw "نام کاربری صحیح نمی باشد."
                }
            }),

        body("password")
            .isLength({ min : 8, max : 18 })
            .withMessage("نام کاربری نمیتواند کمتر از 8 کاراکتر و بیشتر از 18 کاراکتر باشد.")
    ]
}
module.exports = {
    registerValidator,
    loginValidator
}