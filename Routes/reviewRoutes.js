const express=require('express');
const router=express.Router({mergeParams:true});
const reviewController=require('./../Controllers/reviewController');
const authController=require('./../Controllers/authController')
const userAuthController=require('./../Controllers/userAuthController')
router
.route('/')
.get(reviewController.getReviews)
.post(authController.protect,
    authController.restrictTo('admin','subadmin'),
    reviewController.setAdminId,
    reviewController.createReview)
router
.route('/:id')
.patch(authController.protect,
    reviewController.setAdminId,
    reviewController.updateReview)    
.delete(
        authController.protect,
        reviewController.deleteReview)  


router
.route('/:userId')
.post(userAuthController.protect,
    userAuthController.restrictTo('user'),
    reviewController.setUserId,
    reviewController.createReview)
    //nested routes for post ing a fooditem review
    //post--> api/v1/foodItems/:foodItemId/reviews
    // +for  a given fooditem id i must post a review
    //how i must redirect to reviewrouter router.use('/api/v1/foodItems/:foodItemId',reviewRouter)
    //ok going to reviewRouter now on post 
module.exports=router;