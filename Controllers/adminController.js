const express=require('express');
const Admin = require('../Models/adminModel');
exports.getProfile=(req,res,next)=>{
    req.params.id =req.admin.id;
    next();
}
//GET ADMINS:
exports. getAllAdmins=async(req,res)=>{
    try
    {
        const admins=await Admin.find(req.query);
        console.log(req.query);
        res.status(200).json({
        status:'success',
        results:admins.length,
        data:{
            admins
        }
    })
    }catch(err){
        res.send(404).json({
            status:'fail',
            message:err

        })
    }   
}

//GET ADMIN BY ID:
exports.getAdminById=async(req,res)=>{
    try
    {
        const admin=await Admin.findById(req.params.id).populate({path:'reviews',select:'-admin review rating fooditem'})
        res.status(200).json({
        status:'success',
        data:{
            admin
        }
    })
    }catch(err){
        res.send(404).json({
            status:'fail',
            message:err

        })
    }   
}

//Create Admin
exports.createAdmin=async(req,res)=>{
    try{
        const newAdmin=await Admin.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                newAdmin
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
    }

//Update Admin

exports.updateAdmin=async(req,res)=>{
    try{
        const updatedAdmin=await Admin.findByIdAndUpdate(req.params.id,
            req.body)
        res.status(200).json({
            status:'success',
            data:{
                admin:updatedAdmin
            }
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}

//Delete Admin

exports.deleteAdmin=async(req,res)=>{
    try{
        const admin=await Admin.findByIdAndUpdate(req.params.id,{active:false});
        res.status(200).json({
        status:'success',
        data:null
    })
    }catch(err){
        res.status(404).json({
            status:fail,
            message:err
        })
    }
}



