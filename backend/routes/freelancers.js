const express=require("express");
const router=express.Router();
const passport=require("passport");
const session=require("express-session");
const freelacerController=require("../controllers/freelancerController");


router.post("/register",freelacerController.register);
router.post("/login",freelacerController.login);


module.exports=router;