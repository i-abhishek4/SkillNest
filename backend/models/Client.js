const mongoose=require("mongoose");

const clientSchema=new mongoose.Schema({
    companyName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    profileUrl:{type:String,default:"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid&w=740"}
})