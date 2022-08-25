const { jwtTokenVerify } = require("../../modules/functions");
const { UserModel } = require("../../models/User")

const checkLogin = async(req, res, next) => {
    try{
        let authError = {status : 401, message : 'لطفا ابتدا وارد حساب کاربری خود شوید.'};

        const authorization = req?.headers?.authorization
        if(!authorization) throw authError;

        let token = authorization.split(" ")?.[1];
        if(!token) throw authError;

        const reuslt = jwtTokenVerify(token);
        const { username } = reuslt
        console.log(reuslt)
        const user = await UserModel.findOne({ username }, { password : 0 });
        if(!user) throw authError;

        req.user = user
        next()
    }catch(err){
        next(err)
    }
}

module.exports = {
    checkLogin
}