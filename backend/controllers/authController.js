exports.logout=(req,res,next)=>{
    req.logout(function(err){
        if(err) return next(err);
        req.session.destroy(()=>{
            res.clearCookie("connect.sid");
            res.json({message:"Logged out successfully"});
        })
    })
}