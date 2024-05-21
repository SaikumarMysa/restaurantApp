const mongoose=require('mongoose');
const categorySchema=new mongoose.Schema({
    category:{
        type:String,
        lowercase:true,
        required:[true, 'category must be named!'],
        enum:['starters','maincourse','beverages','desserts']
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
const Category=mongoose.model('Category',categorySchema);
module.exports=Category;