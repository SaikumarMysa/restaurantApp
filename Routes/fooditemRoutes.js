const express=require('express');
const foodItemController=require('./../Controllers/foodItemController');
const userAuthController=require('./../Controllers/userAuthController');
const reviewRouter=require('./reviewRoutes');
const router=express.Router();
router
.route('/')
.get(foodItemController.getAllFoodItems)
.post(userAuthController.protect,
userAuthController.restrictTo('superadmin','admin'),
foodItemController.createFoodItem)
router
.route('/:foodItemId')
.get(foodItemController.getFoodById)
// .patch(
//     userAuthController.protect,
//     userAuthController.restrictTo('superadmin','admin'),
//     userAuthController.uploadFooditemImages,
//     userAuthController.resizeFooditemImages,
//     foodItemController.updateFoodItem)
.delete(userAuthController.protect,
userAuthController.restrictTo('superadmin'),
foodItemController.deleteFoodItem)

router.use('/:fooditemId/reviews',reviewRouter);
module.exports=router;