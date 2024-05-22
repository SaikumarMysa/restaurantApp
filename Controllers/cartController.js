const Cart=require('./../Models/cartModel');
//VIEW CART
exports.viewCart=async(req,res)=>{
    try{
        const cart=await Cart.find().populate('items');
        res.status(200).json({
        status:'success',
        data:{
            cart
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }  
}
//GET CART DETAILS BY PASSING ID
exports.getCartById=async(req,res)=>{
    try{
        const cart=await Cart.findById(req.params.id).populate('items');
        res.status(200).json({
        status:'success',
        data:{
            cart
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }  
}
//ADD ITEM TO CART
exports.addToCart=async(req,res)=>{
    console.log('b')
    try{
        console.log('c')
        const newcart=await Cart.create(req.body);
        console.log('d')
        res.status(201).json({
        status:'success',
        data:{
            newcart
        }
    })
    console.log('e')
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }  
}
//REMOVE FROM CART
exports.removeItem=async(req,res)=>{
    try{
        await Cart.findByIdAndUpdate(req.params.id);
        res.status(200).json({
        status:'success',
        data: null   
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }  
}