const Cart=require('./../Models/cartModel');
const itemSchema=require('./../Models/itemSchema');
const Fooditem=require('./../Models/foodItemModel');
const AppError=require('./../utils/appError')

//ADD  ITEM TO CART
exports.addToCart=async(req,res)=>{
    const adminId=req.params.adminId;
    const userId=req.params.userId;
    const{itemId,quantity}=req.body;
    try{
        let cart=await Cart.findOne({userId});
        let food=await Fooditem.findById(itemId);
        //console.log(food.price)
        if(cart){
            //if added same item to cart, then finding its index
            let itemIndex=cart.items.findIndex(p=>p.itemId.toString()===itemId);
            if(itemIndex>-1){
                //item exists in the cart ,update item quantity and total(price)
                cart.items[itemIndex].quantity+=quantity;
                cart.items[itemIndex].price=food.price;
                cart.items[itemIndex].total=cart.items[itemIndex].quantity*food.price;
            }
            else{
                //item doesnot exists in cart(if a new item is added ), so add new item
                //cart.items.push({itemId,quantity,price,total:quantity*price});
                cart.items.push({
                    itemId:itemId,
                    quantity:quantity,
                    price:food.price,
                    total:quantity*food.price
                })
            }
        }else{
            //when there is ***NO CART***-->create a newcart
            //also add new items
            let price=food.price
            cart = new Cart({
                userId,
                items:[{itemId,quantity,price:food.price,total:quantity*price}],
            });
        }
        // Update the subtotal
        cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
        const newCart = await cart.save();
        res.status(201).json({
            status: 'success',
            data: {
                cart: newCart
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong'
        });
    }
};

// GET USER CART based on his userId
exports.getCart=async(req,res)=>{
    try{
        const userId=req.params.userId;
        const cart=await Cart.findOne({userId});
        res.status(200).json({
            status:'success',
            results:cart.items.length,
            data:{
                cart
            }
        });
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err.message
        })   
    }
}

// REMOVE ITEM FROM CART
exports.removeFromCart=async(req,res)=>{
    try{
        const userId=req.params.userId;
        //console.log(userId)
        const itemId=req.body.itemId;
        //console.log(itemId)
        const cart=await Cart.findOne({userId})
        if(!cart) return res.status(400).json({
            message:'No Cart is found for this user'
        })
        let itemIndex=cart.items.findIndex(p=>p.itemId.toString()===itemId);
        //console.log(itemIndex)
        if(itemIndex>-1){
            cart.items.splice(itemIndex,1);
            //recalculate subTotal
            cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
            const removedCart=await cart.save();
            res.status(201).json({
                status:'success',
                message:'Item removed from Cart!'
            })
        }else{
                res.status(400).json({
                status:'fail',
                message:'Item doesnot exist in Cart!'
            })
        }    
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err.message
        })
    }
}

