const Project=require("../models/Project");

exports.allProjects=async(req,res)=>{
    try{
        const filter = {};
        if (req.query.assignedTo) {
            filter.assignedTo = req.query.assignedTo;
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const projects = await Project.find(filter).populate('postedBy', 'companyName email');
        res.json(projects);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
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

exports.updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const update = req.body;
      const project = await Project.findByIdAndUpdate(id, update, { new: true });
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};