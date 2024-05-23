const Order=require('./../Models/orderModel');
// CREATE ORDER
exports.createOrder=async(req,res)=>{
    try{
        const order=await Order.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                order
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

//VIEW ORDER
//VIEW CART
exports.viewOrder=async(req,res)=>{
    try{
        console.log('a')
        const order=await Order.find()
        //.populate({path:'products',select:'foodItem'});
        console.log(order)
        res.status(200).json({
        status:'success',
        data:{
            order
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }  
}
