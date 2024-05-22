const express=require('express');
const cartController=require('./../Controllers/cartController');
const router=express.Router();
router
.route('/')
.get(cartController.viewCart)
.post(cartController.addToCart)

 router
 .route('/:id')
 .get(cartController.getCartById)
 .delete(cartController.removeItem)

// .delete(cartController.removeFromCart)
module.exports=router;