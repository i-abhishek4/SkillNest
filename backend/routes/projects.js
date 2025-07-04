const express=require("express");
const router=express.Router();
const projectController=require("../controllers/projectController");

router.get("/",projectController.allProjects);
router.get("/:id",projectController.projectId);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports=router;
