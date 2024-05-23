const express=require('express');
const authController=require('./../Controllers/authController');
const cartController=require('./../Controllers/cartController');
const router=express.Router();
router
.route('/')
.get(cartController.viewCart)
.post(authController.checkCart,cartController.addToCart) //cartController.checkCart,

 router
 .route('/:id')
 .get(cartController.getCartById)
 .delete(cartController.removeItem)

// .delete(cartController.removeFromCart)
module.exports=router;