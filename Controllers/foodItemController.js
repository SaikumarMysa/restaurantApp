const AppError = require('../utils/appError');
const Fooditem = require('./../Models/foodItemModel');
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync')
const multer=require('multer');
const sharp=require('sharp')
const multerStorage=multer.memoryStorage();
const multerFilter=(req,files,cb)=>{
    if(files.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new AppError('Not an image! please upload only images',400),false)
    }
};
const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});
exports.uploadFooditemImages=upload.fields([
    {name:'imageCover',maxCount:1},
    {name:'images',maxCount:3}
]);
//RESIZING FOR MULTIPLE IMAGES
exports.resizeFooditemImages=catchAsync(async(req,res,next)=>{
    if(!req.files.imageCover||!req.files.images) return next();
    //1.coverimage
    req.body.imageCover=`fooditem-${req.params.foodItemId}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/fooditems/${req.body.imageCover}`)
    //2.images
    req.body.images=[];
    await Promise.all(
    req.files.images.map(async (file,i)=>{
    const filename=`fooditem-${req.params.foodItemId}-${Date.now()}-${i+1}.jpeg`;
    sharp(file.buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/fooditems/${filename}`)
    req.body.images.push(filename)
    })
)
next();
})

//GET ALL FOODITEMS:
exports.getAllFoodItems=catchAsync(async(req,res)=>{
        //const foodItems=await Fooditem.find(req.query)
        //Execute query
        // const features= new APIFeatures(Fooditem.find(req.params.id),req.query)
        const features= new APIFeatures(Fooditem.find(),req.query)
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
})

//GET BY ID:
exports.getFoodById=catchAsync(async(req,res)=>{
    const foodItem=await Fooditem.findById(req.params.foodItemId)
        res.status(200).json({
            status:'success',
            data:{
                foodItem
            }
        })
})

// POST FOODITEMS:
exports.createFoodItem=catchAsync(async(req,res) =>{
    const newFoodItem = await Fooditem.create(req.body);
        res.status(201).json({
        status:'success',
        data:{
            newFoodItem
        }
    })
})

//update fooditem
exports.updateFoodItem=catchAsync(async(req,res)=>{
const updatedFood = await Fooditem.findByIdAndUpdate(req.params.foodItemId,req.body,{new:true, runValidators:true});
    res.status(200).json({
    status:'success',
    data:{
        updatedFood
    }
    })
})

//delete Fooditem
exports.deleteFoodItem=catchAsync(async(req,res)=>{
        await Fooditem.findByIdAndUpdate(req.params.foodItemId,{active:false});
        res.status(200).json({
        status:'success',
        data:null
    })
})

