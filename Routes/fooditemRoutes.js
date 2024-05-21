const express=require('express');
const foodItemController=require('./../Controllers/foodItemController');
const authController=require('./../Controllers/authController');
const router=express.Router();
router
.route('/')
.get(foodItemController.getAllFoodItems)
.post(authController.protect,authController.restrictTo('superadmin','admin'),foodItemController.createFoodItem)
router
.route('/:id')
.get(foodItemController.getFoodItem)
.patch(authController.protect,authController.restrictTo('superadmin','admin'),foodItemController.updateFoodItem)
.delete(authController.protect,authController.restrictTo('superadmin'),foodItemController.deleteFoodItem)
module.exports=router;