const express=require('express');
const userAuthController=require('./../Controllers/userAuthController');
const cartController=require('./../Controllers/cartController');
const router=express.Router();
 router
 .route('/:userId')
 .get(userAuthController.protect,cartController.getCart)
 .post(userAuthController.protect,
userAuthController.setUserId,
cartController.addToCart)
 .delete(userAuthController.protect,cartController.removeFromCart)
module.exports=router;