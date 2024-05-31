const express=require('express');
const foodItemController=require('./../Controllers/foodItemController');
const authController=require('./../Controllers/authController');
//const reviewController=require('./../Controllers/reviewController')
const reviewRouter=require('./reviewRoutes');
const router=express.Router();
router
.route('/')
.get(foodItemController.getAllFoodItems)
.post(authController.protect,authController.restrictTo('superadmin','admin'),foodItemController.createFoodItem)
router
.route('/:id')
.get(foodItemController.getFoodById)
.patch(
    authController.protect,
    authController.restrictTo('superadmin','admin'),
    foodItemController.uploadFooditemImages,
    foodItemController.resizeFooditemImages,
    foodItemController.updateFoodItem)
.delete(authController.protect,authController.restrictTo('superadmin'),foodItemController.deleteFoodItem)

// router
// .route('/:fooditemId/reviews')
// .post(authController.protect,
//     authController.restrictTo('subadmin','admin'),
//     reviewController.createReview
// )
router.use('/:fooditemId/reviews',reviewRouter);
module.exports=router;