const { UserModel } = require("../../models/User")
const { hashString } = require("../../modules/functions")

class AuthController {
    async register(req, res, next){
        const {username, mobile, email, password} = req.body
        const hash_password = hashString(password);

        const user = await UserModel.create({ username, mobile, email, password : hash_password })
        return res.json(user)
    }

    login(){

    }

    resetPassword(){

    }
}

module.exports = {
    AuthController : new AuthController()
}