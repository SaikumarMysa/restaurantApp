const mongoose=require('mongoose');
const Review=require('./reviewModel');
const foodSchema=new mongoose.Schema({
    category:{
        type:String,
        lowercase:true,
        required:[true, 'category must be named!'],
        enum:['starters','maincourse','beverages','desserts']
    },
    name:{
        type:String,
        required:[true,'food item must have a name'],
    },
    price:{
        type:Number,
        required:true
    },
    images:[String],
    imageCover:{
        type:String,
        //required:[true,'A fooditem must have a cover image']
    },
    description:{
        type:String,
        trim:true
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    ratingsQuantity:{
        type:Number,
        default:0,
        required:true
    },
    ratingsAverage:{
        type:Number,
        default:0,
        required:true
    }
       
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

//virtual for showing reviews on fooditems
foodSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'fooditem',
    localField:'_id'
})
foodSchema.pre('save',function(next){
    //console.log('saves doc');
    next();
})
//querymiddleware
foodSchema.pre(/^find/,function(next){
    this.populate({
        path:'reviews',
        select:'review rating  -fooditem -_id'
    })
    next();
})
foodSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    //this.find();
    next();
})
const Fooditem=mongoose.model('Fooditem',foodSchema);
module.exports=Fooditem;