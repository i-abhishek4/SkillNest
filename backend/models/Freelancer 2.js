const mongoose=require("mongoose");

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
    password:{
        type:String,
        required:true
    },
    skills:[String],
    bio:{type:String},
    profileUrl:{type:String,default:"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid&w=740"}
});
module.exports=mongoose.model("Freelancer",freelancerSchema);