const mongoose=require('mongoose');
const Food=require('./foodModel');
const categorySchema=new mongoose.Schema({
    category_id:Number,
    category:{
        type:String,
        required:[true,'category must have a name']
    },
    description:{
        type:String,
        trim:true
    },
    items:[
        {
        type:mongoose.Schema.ObjectId,
        ref:'Food'
        }
    ]
})
const Category=mongoose.model('Category',categorySchema);