const { updateSearchIndex } = require('../Models/foodItemModel');
const Review=require('./../Models/reviewModel');
const AppError=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');
exports.setUserId=(req,res,next)=>{
    if(!req.body.user) req.body.user =req.user.id;
    next();
}
//GET ALL REVIEWS
exports.getReviews=catchAsync(async(req,res)=>{
    let filter={};
    if(req.params.fooditemId) filter={fooditem:req.params.fooditem}
    const reviews= await Review.find(filter)
    res.status(200).json({
    status:'success',
    results:reviews.length,
    data:{
        reviews
        }
    })
})

//GET REVIEW BY ID:
exports.getReviewById=catchAsync(async(req,res)=>{
        const review=await Review.findById(req.params.id)
        res.status(200).json({
        status:'success',
        data:{
            review
            }
        })   
})

//CREATE REVIEW
exports.createReview=catchAsync(async(req,res)=>{
    if(!req.body.fooditem) req.body.fooditem=req.params.fooditemId
    if(!req.body.user) req.body.user =req.user.id;
    const newReview=await Review.create(req.body);
        res.status(201).json({
        status:'success',
        data:{
            newReview
            }
        })
    }
)

//DELETE REVIEW
exports.deleteReview=catchAsync(async(req,res)=>{
    const review= await Review.findByIdAndUpdate(req.params.id,{active:false})
        res.status(200).json({
            status:'success',
            data:null
        })
    }
)

//UPDATE REVIEW
exports.updateReview=catchAsync(async(req,res)=>{
    const review= await Review.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        res.status(200).json({
            status:'success',
            date:{
                newReview:review
            }
        })
})

//GET MY REVIEWS
exports.getMyReviews=catchAsync(async(req,res,next)=>{
    const userId=req.user.id
    const myReview=await Review.findOne({user:userId});
        res.status(200).json({
            status:'success',
            data:{
                myReview
            }
        })
    next();
})







