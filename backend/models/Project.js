const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client'
    },
    requiredSkills: [String],
    category: {
        type: String,
        enum: [
            "Writing & Translation",
            "Programming & Development",
            "Administrative & Secretarial",
            "Design & Art",
            "Business & Finance",
            "Sales & Marketing",
            "Others"
        ],
        // required: true
    },
    budget: { type: String, required: true },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed'],
        default: 'open'
    },
    applications:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Freelancer'

    }],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Freelancer",
        default: null,
      },

});

module.exports=mongoose.model("Project",projectSchema);