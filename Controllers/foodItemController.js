const Fooditem = require('./../Models/foodItemModel');
const APIFeatures=require('./../utils/apiFeatures');
//GET ALL FOODITEMS:

exports.getAllFoodItems=async(req,res)=>{
    
    try{
        //const foodItems=await Fooditem.find(req.query)

        //Execute query
        const features= new APIFeatures(Fooditem.find(req.params.id),req.query)
        .filter()
        .paginate()

        const foodItems=await features.query;
       
        res.status(200).json({
            status:'success',
            results:foodItems.length,
            data:{
                foodItems
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

//GET BY ID:

exports.getFoodItem=async(req,res)=>{
    try{
        const foodItem=await Fooditem.find(req.params.id)
        res.status(200).json({
            status:'success',
            data:{
                foodItem
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

// POST FOODITEMS:
exports.createFoodItem= async(req,res) =>{
    try{
        const newFoodItem = await Fooditem.create(req.body);
        res.status(201).json({
        status:'success',
        data:{
            newFoodItem
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }   
}

//update fooditem
exports.updateFoodItem= async(req,res)=>{
    try{
        const updatedFood = await Fooditem.findByIdAndUpdate(req.params.id,req.body);
        res.status(200).json({
        status:'success',
        data:{
            updatedFood
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }    
}

//delete Fooditem
exports.deleteFoodItem=async(req,res)=>{
    try{
        await Fooditem.findByIdAndUpdate(req.params.id,{active:false});
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

