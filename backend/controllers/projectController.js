const Project=require("../models/Project");

exports.allProjects=async(req,res)=>{
    try{
        const projects=await Project.find();
        res.json(projects);
    }catch(err){
        console.log(err);
    }
}