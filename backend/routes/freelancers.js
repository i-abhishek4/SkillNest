const express=require("express");
const router=express.Router();
const freelacerController=require("../controllers/freelancerController");
const projectController=require("../controllers/projectController");


router.post("/register",freelacerController.register);
router.post("/login",freelacerController.login);
router.get("/logout",freelacerController.logout);
// router.get("/dashboard",freelacerController.dashboard);
router.get("/:id",freelacerController.getProfile);
router.put("/:id",freelacerController.updateProfile);
router.post("/apply/:id",freelacerController.applyToProject);



module.exports=router;