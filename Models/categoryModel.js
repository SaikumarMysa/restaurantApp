const mongoose=require('mongoose');
const categoryEnum=['starters','maincourse','beverages','desserts']
const Fooditem=require('./foodItemModel')
const categorySchema=new mongoose.Schema({
    category:{
        type:String,
        unique:true,
        lowercase:true,
        required:[true, 'category must be named!'],
        enum:categoryEnum    
    },
    description:{
        type:String,
        trim:true
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})

//querymiddleware
categorySchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    next();
})

//indexes
//below index is for having a single named category, preventing multiple categories of same name
categorySchema.index({category:1},{unique:true})
const Category=mongoose.model('Category',categorySchema);
module.exports=Category;