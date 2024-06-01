const express=require('express');
const router=express.Router({mergeParams:true});
const reviewController=require('./../Controllers/reviewController');
const userAuthController=require('./../Controllers/userAuthController')
router
.route('/')
.get(reviewController.getReviews)
//here we create review based on a fooditem id , previously createReview takes all the otheer data like specified on review model
.post(userAuthController.protect,
    userAuthController.setUserId,
    reviewController.createReview)
.delete(reviewController.deleteReview)
module.exports=router;