const passport = require("passport");
const Freelancer = require("../models/Freelancer");

exports.register = async (req, res) => {
    const { name, email, password, skills, bio, } = req.body;

    try {
        const existing = await Freelancer.findOne({ email });
        if (existing) {
            res.status(400).json({ message: "Eamila already registerd" });
        }
        const newFreelancer = new Freelancer({ name, email, skills, bio });

        //encypting the password and saving
        const registeredFreelancer = await Freelancer.register(newFreelancer, password);
        req.login(registeredFreelancer, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(req.user);

        })
    }catch(err){
        console.log(err);
    }
    
}


exports.login = (req, res, next) => {
    passport.authenticate("freelancer-local", { failureRedirect: "/login", failureFlash: true }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            // req.flash("error", "Invalid credentials");
            console.log("invliad creds")
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            // req.flash("success", "Logged in successfully!");
            console.log("logged in siccessfully")
            return res.redirect("/freelancer/dashboard");
        });
    })(req, res, next);
};
