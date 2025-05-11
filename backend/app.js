const express=require("express");
const mongoose=require("mongoose");
const app=express();
const Freelancer=require("./models/Freelancer");

mongoose.connect("mongodb://localhost:27017/skillnest")
.then(()=>{console.log("Connection established successfully")})
.catch((err)=>{console.log("Mongodb connection error",err)});


app.listen(3000,()=>{
    console.log("Server running");
})

