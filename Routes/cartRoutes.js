const express=require('express');
const authController=require('./../Controllers/authController');
const cartController=require('./../Controllers/cartController');
const router=express.Router();

 router
 .route('/:userId')
 .get(cartController.getCart)
 .post(cartController.addToCart)
 .delete(cartController.removeFromCart)
//  .patch(cartController.updateCart);

module.exports=router;