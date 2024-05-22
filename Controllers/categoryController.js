const express=require('express');
const Category=require('./../Models/categoryModel')
//GET ALL CATEGORIES:
exports.getAllCategories=async(req,res) => {
    try{
        const categories=await Category.find(req.query);
        //console.log(req.query);
    res.status(200).json({
        status:'success',
        data:{
            categories
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }   
}

//GET CATEGORY BY ID:
exports.getCategoryById=async(req,res) => {
    try{
        const category=await Category.findById(req.params.id);
        res.status(200).json({
        status:'success',
        data:{
            category
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }   
}

//CREATE CATEGORY

exports.createCategory = async(req,res)=>{
    try{
        const newCategory = await Category.create(req.body);
        res.status(201).json({
        status:'success',
        data:{
            newCategory
        }
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    } 
}

// UPDATE CATEGORY

exports.updateCategory=async(req,res) =>{
    try{
        const updatedCategory= await Category.findByIdAndUpdate(req.params.id, req.params.body);
        res.status(200).json({
        status:'success',
        data:{
            updatedCategory
        }
    })
    }catch(err){
        res.status(404).json({
            status:'success',
            message:err
        })
    } 
}

// DELETE CATEGORY

exports.deleteCategory =async(req,res)=>{
    try{
        await Category.findByIdAndUpdate(req.params.id,{active:false})
        res.status(204).json({
        status:'success',
        data:null
    })
    }catch(err){
        res.status.json({
            status:'fail',
            message:err
        })
    }
    
}