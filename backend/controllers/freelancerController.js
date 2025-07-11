const passport = require("passport");
const Freelancer = require("../models/Freelancer");
const Project = require("../models/Project");


exports.register = async (req, res) => {
    const { name, email, password, skills, bio, } = req.body;

    try {
        const existing = await Freelancer.findOne({ email });
        if (existing) {
            return res.status(400).json({success:false, message: "Email already registerd" });
        }
        const newFreelancer = new Freelancer({ name, email, skills, bio });

        //encypting the password and saving
        const registeredFreelancer = await Freelancer.register(newFreelancer, password);
        req.login(registeredFreelancer, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Login failed after signup"});
              }
            console.log("User after login",req.user);
            return res.status(201).json({ success: true, message: "Signup successful",user:{id:registeredFreelancer._id,name: registeredFreelancer.name,
                email: registeredFreelancer.email,
                role: registeredFreelancer.role}});

        })
    }catch(err){
        console.log(err.message);
        if(err.name === "UserExistsError"){
            return res.json({success:false, message: "Email already exists"});
        }
        // generic error
        return res.json({success:false, message: "Something went wrong"});
        
        
    }
    
}

exports.getAllFreelancers=async (req,res)=>{
    try{
        const {skill,name}=req.query;

        const query={};
        if (skill || name) {
            const search = skill || name;
            query.$or = [
              { name: { $regex: search, $options: "i" } },
              { skills: { $regex: search, $options: "i" } },
            ];
          }

        const freelancers = await Freelancer.find(query).select("-password");
        res.json(freelancers);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// exports.dashboard=(req,res)=>{
//     return res.json({message:"Freelancer dashboard"})
// }

exports.login = (req, res, next) => {
    passport.authenticate("freelancer-local", { failureRedirect: "freelancer/login"}, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            // req.flash("error", "Invalid credentials");
            console.log("invliad creds")
            return res.redirect("freelancer/login");
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            console.log("logged in siccessfully")
            console.log("req.user before check:", req.user);
            return res.json({success:true,message:"log in successfull",user:{id:user._id,name: user.name,
                email: user.email,
                role: user.role}});
        });
    })(req, res, next);
};


exports.getProfile=async(req,res)=>{
    try{
        const freelancer=await Freelancer.findById(req.params.id);
        if(!freelancer){
            return res.json({message:"Not profile exists"});
        }
        return res.json(freelancer);
    }catch(err){
        console.log("err getting freelancer profile",err.message);
    }
}

exports.updateProfile=async(req,res)=>{
    try{
        const freelancer=await Freelancer.findById(req.params.id);
        if(!freelancer){
            return res.json({message:"Not profile exists"});
        }
        const {name, email, skills, bio,}=req.body;
        if(name) freelancer.name=name;
        if(email) freelancer.email=email;
        if(skills) freelancer.skills=skills;
        if(bio) freelancer.bio=bio;

        const updatedFreelancer=await freelancer.save();
        return res.json("Updated profile");
        
    }catch(err){
        console.log("err updating freelancer profile",err.message);
    }
}
exports.logout=(req,res,next)=>{
    req.logout(function(err){
        if(err) return next(err);
        req.session.destroy(()=>{
            res.clearCookie("connect-sid");
            res.json({message:"Logged out successfully"});
        })
    })
}

exports.applyToProject=async(req,res)=>{
    console.log("req.user before check:", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
    console.log(req.user);
    const freelancerId=req.user._id;
    console.log("freelancerId",freelancerId);
    const projectId=req.params.id;
    console.log(req.params);
    console.log("projectId",projectId);
    
    const project=await Project.findById(projectId);
    const freelancer=await Freelancer.findById(freelancerId);

    if(!project || !freelancer){
        return res.json({message:"Project or freelancer deoes exist"});
    }
    const alreadyApplied = project.applications
    .map(id => id.toString())
    .includes(freelancerId.toString());
  console.log("Already applied?",alreadyApplied);
  if (alreadyApplied) {
    return res.json({ message: "Already applied to this project" });
  }
  
    project.applications.push(freelancerId);
    await project.save();
    console.log("Succesfully applied to the project");
    return res.json({message:"Applied to the project"});
    
}

exports.markProjectCompleted = async (req, res) => {
  try {
    const { projectId } = req.params;
    const freelancerId = req.user._id;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.assignedTo) !== String(freelancerId))
      return res.status(403).json({ message: "You are not assigned to this project" });
    project.status = "completed";
    await project.save();
    res.json({ message: "Project marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};