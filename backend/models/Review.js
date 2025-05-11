const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Freelancer'
    },
    date:{
        type:Date,
        default:Date.now()
    },
    comment:{
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5
    }
});

module.exports=mongoose.model("Review",reviewSchema);