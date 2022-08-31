const autoBind = require("auto-bind");
const { ProjectModel } = require("../../models/Project");

class ProjectController {
    constructor() {
        autoBind(this)
    }
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

    async findProject(projectID, leader) {
        const project = await ProjectModel.findOne({ leader, _id : projectID });
        if(!project) throw { status : 404, message : "پروژه ای یافت نشد!!" };
        return project;
    }

    async getProjectById(req, res, next){
        try{
            const leader = req.user._id;
            const projectID = req.params.id;
            const project = await this.findProject(projectID, leader);

            return res.status(200).json({
                status : 200,
                success : true,
                project
            })
        }catch(err){
            next(err)
        }
    }

    getAllProjectOfTeam(){
        
    }

    getProjectOfUser(){

    }

    updateProject(){

    }

    async removeProject(req, res, next){
        try{
            const leader = req.user._id;
            const projectID = req.params.id;
            const project = await this.findProject(projectID, leader);

            const deletedProjectResult = await ProjectModel.deleteOne({ _id : project._id });
            if(deletedProjectResult.deletedCount == 0) throw { status : 400, message : "پروژه مورد نظر حذف نشد.." };

            return res.status(200).json({
                status : 200,
                success : true,
                message : 'پروژه با موفقیت حذف شد.'
            })
        }catch(err){
            next(err)
        }
    }
}

module.exports = {
    ProjectController : new ProjectController()
}