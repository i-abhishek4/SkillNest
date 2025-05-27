const express=require("express");
const mongoose=require("mongoose");
const app=express();
const Freelancer=require("./backend/models/Freelancer");
const Client=require("./backend/models/Client");
const passport=require("passport");
const session=require("express-session");
const cors=require("cors");



//mongo connection
mongoose.connect("mongodb://localhost:27017/skillnest")
.then(()=>{console.log("Connection established successfully")})
.catch((err)=>{console.log("Mongodb connection error",err)});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

// session middleware
const sessionoptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionoptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use('client-local',Client.createStrategy());
passport.use('freelancer-local',Freelancer.createStrategy());
passport.serializeUser((account,done)=>{
    done(null,{id: account._id, role: account.role})
});
passport.deserializeUser(async ({id,role},done)=>{
    try{
        let account;
        if(role==='Client'){
            account=await Client.findById(id);
        }else if(role==='Freelancer'){
            account=await Freelancer.findById(id);
        }
        if (account) {
            done(null, account); 
        } else {
            done(null, false);
        }
    }catch(err){
        done(err);
    }
})

//routes
app.use("/freelancer",require("./backend/routes/freelancers"));
app.use("/client",require("./backend/routes/clients"));
app.use("/projects",require("./backend/routes/projects"));



app.get('/auth/me', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not logged in' });
    }
    res.json({ user: req.user });
  });


app.listen(3000,()=>{
    console.log("Server running");
})

