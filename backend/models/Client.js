const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const clientSchema=new mongoose.Schema({
    companyName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,default:"Client"},
    profileUrl:{type:String,default:"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid&w=740"}
})

clientSchema.plugin(passportLocalMongoose,{ usernameField: 'email', usernameUnique: false});
module.exports=mongoose.model("Client",clientSchema);