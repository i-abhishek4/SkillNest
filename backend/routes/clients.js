const express=require("express");
const router=express.Router();
const clientController=require("../controllers/clientController");

router.post("/register",clientController.register);
router.post("/login",clientController.login);
router.get("/logout",clientController.logout)
router.get("/projects",clientController.getProjects);
router.get("/:id",clientController.getProfile);
router.put("/:id",clientController.updateProfile);
router.post("/project",clientController.postProject);
router.get("/applicants/:id",clientController.getApplicants);
router.put("/select/:projectId/:freelancerId",clientController.assignFreelancer);


module.exports=router;