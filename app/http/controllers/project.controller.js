const { ProjectModel } = require("../../models/Project");

class ProjectController {
    async createProject(req, res, next){
        try{
            const { title, text, image, tags } = req.body;
            const leader = req.user._id;

            const result = await ProjectModel.create({ title, text, leader, image, tags });
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

    getAllProject(){

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