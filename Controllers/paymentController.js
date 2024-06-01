const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const Cart=require('./../Models/cartModel');
const AppError=require('./../utils/appError');
exports.getCheckOutSession=async(req,res,next)=>{
    //1.Getting the cart
    const cart=await Cart.findById(req.params.cartId);
    console.log(cart)
    console.log(cart.subTotal);
    //2. create checkout session
    const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/cart/${cart.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.cartId,
        mode:'payment',
        line_items:[
            {
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:'fooditem'
                    },
                    unit_amount:cart.subTotal
                },
                quantity:1
            }
        ]
    })
    //3.create session as response
    res.status(200).json({
        status:'success',
        session
    })
    next();
}