const mongoose=require('mongoose');
const Fooditem=require('./foodItemModel');
const User=require('./userModel');
const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review cannot be empty']
    },
    rating:{
        type:Number,
        max:5,
        min:1
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    fooditem:{
        type:mongoose.Schema.ObjectId,
        ref:'Fooditem',
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    }

})
reviewSchema.pre('save',function(next){
    next();
})
//querymiddleware
reviewSchema.pre(/^find/,function(next){
    //this points to the current query
    this.find({active:{$ne:false}})
    next();
})

//CALCULATING AVERAGE RATINGS
//statics  for using aggregate
reviewSchema.statics.calAverageRatings=async function(fooditemId)
{
    //const Fooditem=require('./foodItemModel');
    const stats=await this.aggregate([
        {
            $match:{fooditem:fooditemId}
        },
        {
            $group:{
                _id:'$fooditem',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}

            }
        }
    ]);
    console.log(stats);
    if(stats.length>0){
        await Fooditem.findByIdAndUpdate(fooditemId,{
            ratingsQuantity:stats[0].nRating,
            ratingsAverage:stats[0].avgRating
        })
    }else{
        await Fooditem.findByIdAndUpdate(fooditemId,{
            ratingsQuantity:0,
            ratingsAverage:3.5
        })
    }
};
reviewSchema.post('save',function(){
    this.constructor.calAverageRatings(this.fooditem);
    
})

//For review update and delete
//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r=await this.findOne();
    next();
})
reviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructor.calAverageRatings(this.r.fooditem)
})

//index for review-admin
//reviewSchema.index({admin:1,fooditem:1},{unique:true});
// reviewSchema.pre('save',function(next){
//     next();
// })

const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;