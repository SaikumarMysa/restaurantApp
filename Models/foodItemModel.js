const mongoose=require('mongoose');
const foodSchema=new mongoose.Schema({
    
    category:{
        type:String,
        lowercase:true,
        required:[true, 'category must be named!'],
        enum:['starters','maincourse','beverages','desserts']
    },
    foodItem_name:{
        type:String,
        required:[true,'food item must have a name'],
    },
    price:Number,
    images:String,
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
foodSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    //this.find();
    next();
})
const Fooditem=mongoose.model('Fooditem',foodSchema);
module.exports=Fooditem;