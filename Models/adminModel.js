const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name!']
    },
    email:{
        type:String,
        required:[true,'Please provide email!'],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'Please provide Password'],
        minlength:8
    },
    passwordConfirm:{
        type:String,
        required:[true,'please provide password'],
        validate:{
            validator: function(el){
               return el===this.password
            }
        }
    },
    passwordChangedAt:Date,
    role:{
        type:String,
        enum:['superadmin','admin','subadmin'],
        required:[true,'please specify your role'],
        default:'subadmin'
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    }
    
    
})
//Document middleware
adminSchema.pre('save',async function (next) {
    //This function only runs if password was actually modified
    if(!this.isModified('password')) return next()
    // Hash the password with cost of 12
    this.password= await bcrypt.hash(this.password, 12);
    //Delete password confirm field
    this.passwordConfirm=undefined;
        next();
})
adminSchema.pre('save',function(next){
  if(!this.isModified('password')||this.isNew) return next()
    this.passwordChangedAt=Date.now()-1000;
 next();  
})

//below logic for checking the password given at the time of logic is same as password that is in our db
adminSchema.methods.correctPassword=async function (candidatePassword,adminPassword){
    //taking values of candidatepassword, adminpassword from  authcontroller
    return await bcrypt.compare(candidatePassword,adminPassword)  
}

//below logic is for password changedAt
adminSchema.methods.changedPasswordAfter= function( JWTTimeStamp ){
    if(this.passwordChangedAt){
        console.log(this.passwordChangedAt, JWTTimeStamp)
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000,10)
        console.log('changedTimeStamp'+changedTimeStamp+'JWTTimeStamp'+JWTTimeStamp)
        return JWTTimeStamp < changedTimeStamp;
    }
    //False means not changed
    return false;
}
//querymiddleware
adminSchema.pre(/^find/,function(next){
    //this points to the current query
    this.find({active:{$ne:false}})
    next();
})
const Admin=mongoose.model('Admin',adminSchema);
module.exports=Admin;

