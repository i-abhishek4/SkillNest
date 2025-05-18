const passport = require("passport");
const Client = require("../models/Client");
const Freelancer = require("../models/Freelancer");
const Project = require("../models/Project");
const { TopologyDescription } = require("mongodb");


exports.register = async (req, res) => {
    const { companyName, email, password } = req.body;
    try {
        const existing = Client.findOne({ email });
        if (existing) {
            res.json({ message: "Email already exists" });
        }
        const newClient = new Client({ companyName, email });

        const registeredClient = Client.register(newClient, password);
        req.login(registeredClient, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(req.user);
        })

    } catch (err) {

    }
}

exports.login = (req, res, next) => {
    passport.authenticate("client-local", { failureRedirect: "client/login", failureFlash: true }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            console.log("invliad creds")
            return res.redirect("freelancer/login");
        }
        req.login(user, (err) => {
            if (err) return next(err);
            console.log("logged in siccessfully")
            // return res.redirect("/client/dashboard");
            return res.json(req.user);
        })
    })(req, res, next);
};


exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/home");
    })
}

exports.getProfile = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.json({ message: "Not profile exists" });
        }
        return res.json(client);
    } catch (err) {
        console.log("err getting client profile", err.message);
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.json({ message: "Not profile exists" });
        }
        const { companyName, email } = req.body;
        if (companyName) client.companyName = companyName;
        if (email) client.email = email;

        const updatedClient = await client.save();
        return res.json("Updated profile");

    } catch (err) {
        console.log("err updating client profile", err.message);
    }
}

exports.postProject = async (req, res) => {
    try {
        const { title, description, requiredSkills, category, budget, } = req.body;
        const postedBy = req.user._id;
        const newProject = new Project({ title, postedBy, description, requiredSkills, category, budget });
        await newProject.save();
        return res.json(newProject);
    } catch (err) {
        console.log("Error posting project", err.message);
    }
}

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ postedBy: req.user._id });
        res.json(projects);
        console.log("Projects fetched siuccessfully");
    } catch (err) {
        console.log("Error getting projects by client", err.message);
    }
}

exports.getApplicants = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("applications", "name email");
        return res.json(project.applications);
    } catch (err) {
        console.log("Error getting applicant ids of a projecr", err.message);
    }
}

exports.assignFreelancer = async (req, res) => {
    try {
        const { freelancerId, projectId } = req.params;
        const freelancer = await Freelancer.findById(freelancerId);
        const project = await Project.findById(projectId);
        // console.log(freelancer);
        console.log(project);


        if (!project || !freelancer)
            return res.json({ message: "Freelancer or project doesnt exist" });
        const hasApplied = project.applications.some(fId => fId._id.toString() === freelancerId);

        if (!hasApplied) {
            return res.status(400).json({ message: "Freelancer did not apply to this project" });
        }
        project.assignedTo = freelancerId;
        project.status = "in-progress"; // optional status change
        await project.save();
        return res.json("successfully assigned project to freelancer")

    } catch (err) {
        console.log("Error assigned project to freelancer", err.message);
    }
}