const { ProjectModel } = require("../../models/Project");

class ProjectController {
    async createProject(req, res, next){
        try{
            const { title, text, image } = req.body;
            const leader = req.user._id;

            const result = await ProjectModel.create({ title, text, leader, image });
            if(!result) throw { status : 400, message : "ایجاد پروژه با خطا مواجه شد." };

            return res.status(200).json({
                status : 200,
                success : true,
                message : "پروژه جدید با موفقیت ایجاد شد."
            })
        }catch(err){
            next(err)
        }
    }

    async getAllProject(req, res, next){
        try{
            const leader = req.user;

            const projects = await ProjectModel.find({ leader });
            return res.status(200).json({
                success : true,
                status : 200,
                projects
            })
        }catch(err){
            next(err)
        }
    }

    getAllProjectById(){
        
    }

    getAllProjectOfTeam(){
        
    }

    getProjectOfUser(){

    }

    updateProject(){

    }

    removeProject(){

    }
}

module.exports = {
    ProjectController : new ProjectController()
}