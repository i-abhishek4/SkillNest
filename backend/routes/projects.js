const express=require("express");
const router=express.Router();
const projectController=require("../controllers/projectController");

router.get("/",projectController.allProjects);

module.exports=router;
