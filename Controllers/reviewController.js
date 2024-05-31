const Review=require('./../Models/reviewModel');
exports.setAdminId=(req,res,next)=>{
    if(!req.body.admin) req.body.admin =req.admin.id;
    next();
}
exports.setUserId=(req,res,next)=>{
    if(!req.body.user) req.body.user =req.user.id;
    next();
}
//GET ALL REVIEWS
exports.getReviews=async(req,res)=>{
    try{
        let filter={};
        if(req.params.fooditemId) filter={fooditem:req.params.fooditem}
        const reviews= await Review.find(filter)
        res.status(200).json({
        status:'success',
        data:{
            reviews
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err.message
        })
    }
 }
//GET REVIEW BY ID:
    exports.getReviewById=async(req,res)=>{
        try
        {
            const review=await Review.findById(req.params.id)
            res.status(200).json({
                status:'success',
                data:{
                review
            }
            })   
        }
        catch(err){
            res.status(404).json({
                status:'fail',
                message:err
            })
        }   
    }
//CREATE REVIEW
exports.createReview=async(req,res)=>{
    try{
        if(!req.body.fooditem) req.body.fooditem=req.params.fooditemId
        if(!req.body.user) req.body.user =req.user.id;
        if(!req.body.admin) req.body.admin =req.admin.id;
        const newReview=await Review.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                newReview
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err.message
        })
    }
}

//UPDATE REVIEW
exports.updateReview=async(req,res)=>{
    try{
        const updatedReview=await Review.findByIdAndUpdate(req.params.id,
            req.body)
        res.status(200).json({
            status:'success',
            data:{
                updatedReview
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

//DELETE REVIEW
exports.deleteReview=async(req,res)=>{
    try{
        console.log('1')
        console.log(req.params.id)
        await Review.findByIdAndUpdate(req.params.id,{active:false})
        console.log('2')
        res.status(200).json({
        status:'success',
        data:null
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

