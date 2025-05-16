const passport=require("passport");
const Client=require("../models/Client");


exports.register=async(req,res)=>{
    const {companyName,email,password}=req.body;
    try{
        const existing=Client.findOne({email});
        if(existing){
            res.json({message:"Email already exists"});
        }
        const newClient=new Client({companyName,email});

        const registeredClient=Client.register(newClient,password);
        req.login(registeredClient,(err)=>{
            if(err){
                console.log(err);
            }
            console.log(req.user);
        })

    }catch(err){

    }
}

exports.login=(req,res,next)=>{
    passport.authenticate("client-local",{failureRedirect:"client/login",failureFlash:true},(err,user,info)=>{
        if(err) return next(err);
        if(!user){
            console.log("invliad creds")
            return res.redirect("freelancer/login");
        }
        req.login(user,(err)=>{
            if (err) return next(err);
            console.log("logged in siccessfully")
            return res.redirect("/client/dashboard");
        })
    })(req, res, next);
};


