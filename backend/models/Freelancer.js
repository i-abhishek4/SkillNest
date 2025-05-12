const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const freelancerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    skills:[String],
    bio:{type:String},
    role:{type:String,default:"Freelancer"},
    profileUrl:{type:String,default:"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid&w=740"}
});

freelancerSchema.plugin(passportLocalMongoose, { usernameField: 'email', usernameUnique: false});
module.exports=mongoose.model("Freelancer",freelancerSchema);