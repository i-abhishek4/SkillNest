const Project=require("../models/Project");

exports.allProjects=async(req,res)=>{
    try{
        const projects = await Project.find().populate('postedBy', 'companyName email');
        res.json(projects);
    }catch(err){
        console.log(err);
    }
}

exports.projectId=async(req,res)=>{
    try{
        const project=await Project.findById(req.params.id).populate('postedBy','companyName email');
        if(!project){
            return res.json({message:"Project not found"});
        }
        return res.json(project);
    }catch(err){
        console.log("error getting project by id",err);
    }
}

