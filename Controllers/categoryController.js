const express=require('express');
const Category=require('./../Models/categoryModel')
const catchAsync=require('./../utils/catchAsync')
//GET ALL CATEGORIES:
exports.getAllCategories=catchAsync(async(req,res)=>{
        const categories=await Category.find(req.query);
        //console.log(req.query);
    res.status(200).json({
        status:'success',
        data:{
            categories
        }
    })
})

//GET CATEGORY BY ID:
exports.getCategoryById=catchAsync(async(req,res) => {
        const category=await Category.findById(req.params.id);
        res.status(200).json({
        status:'success',
        data:{
            category
        }
    })
})

//CREATE CATEGORY
exports.createCategory=catchAsync(async(req,res)=>{
        const newCategory = await Category.create(req.body);
        res.status(201).json({
        status:'success',
        data:{
            newCategory
        }
    })
})

// UPDATE CATEGORY
exports.updateCategory=catchAsync(async(req,res)=>{
        const updatedCategory= await Category.findByIdAndUpdate(req.params.id, req.params.body);
        res.status(200).json({
        status:'success',
        data:{
            updatedCategory
        }
    })
})

// DELETE CATEGORY
exports.deleteCategory=catchAsync(async(req,res)=>{
        await Category.findByIdAndUpdate(req.params.id,{active:false})
        res.status(204).json({
        status:'success',
        data:null
    })
})