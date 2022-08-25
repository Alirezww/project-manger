class UserController {
    getProfile(req, res, next) {
        try{
            const user = req.user
            return res.status(200).json({
                status : 200,
                sucess : true,
                user
            })
        }catch(err){
            next(err)
        }
    }

    editProfile(){

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