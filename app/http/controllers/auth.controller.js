const { UserModel } = require("../../models/User")
const { hashString, tokenGenerator } = require("../../modules/functions")

const bcrypt = require("bcrypt")

class AuthController {

    async register(req, res, next){
        try{
            const {username, mobile, email, password} = req.body
            const hash_password = hashString(password);
            const user = await UserModel.create({ username, mobile, email, password : hash_password })
            return res.status(201).json({
                status : 201,
                success : true,
                message : "کاربر جدید با موفقیت ایجاد شد."
            })
        }catch(err){
            next(err)
        }
    }

    async login(req, res, next){
        try{
            console.log(req.headers)
            const { username, password } = req.body
            const user = await UserModel.findOne({ username });
            if(!user) throw {status : 401,message : 'نام کاربری یا رمز عبور غلط می باشد.' };
            const compareResult = bcrypt.compareSync(password, user.password);
            if(!compareResult) throw {status : 401,message : 'نام کاربری یا رمز عبور غلط می باشد.' };
            const token = tokenGenerator({ username });

            user.token = token;
            await user.save()

            return res.status(200).json({
                status : 200,
                success : true,
                message : 'شما با موفقیت وارد حساب کاربری خود شدید.',
                token : token
            })
        }catch(err){
            next(err)
        }
    }

    resetPassword(){

    }
}

module.exports = {
    AuthController : new AuthController()
}