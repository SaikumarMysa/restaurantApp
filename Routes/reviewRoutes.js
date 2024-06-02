const express=require('express');
const router=express.Router({mergeParams:true});
const reviewController=require('./../Controllers/reviewController');
const userAuthController=require('./../Controllers/userAuthController')
router.get('/myReview',userAuthController.protect,reviewController.getMyReviews)
router
.route('/')
.get(reviewController.getReviews)
.post(userAuthController.protect,
userAuthController.setUserId,
reviewController.createReview)
router
.route('/:id')
.get(reviewController.getReviewById)
.patch(userAuthController.protect,userAuthController.setUserId,reviewController.updateReview)
.delete(reviewController.deleteReview)   
module.exports=router;