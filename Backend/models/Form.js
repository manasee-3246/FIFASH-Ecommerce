import mongoose from "mongoose";    
const formSchema = new mongoose.Schema({
    First_name:{
        type:String,
        required:true
    },
    Last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."]
    },
    phone:{
        type:String,
        required:true,
        match:[/^\d{10}$/, "Phone number must be exactly 10 digits."]
    },
    Collage_Name:{
        type:String,
        required:true
    },

    Degree:{
        type:String,
        required:true
    },
    Semester:{
        type:String,
        required:true
    },
    Branch:{
        type:String,
        required:true
    },
    SPI:{
        type:Number,
        required:true
    },
    passing_year:{
        type:Number,
        required:true
    }
},{timestamps:true});
export default mongoose.model("Form",formSchema);
