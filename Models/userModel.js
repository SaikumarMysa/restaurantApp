//const crypto=require('crypto');
const mongoose=require('mongoose');
const validator=require('validator')
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const Review=require('./reviewModel')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name']
    },
    email:{
        type:String,
        required:[true,'please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please provide a password'],
        validate:{
            validator:function(el){
            return el===this.password
        }
    }  
    },
    passwordChangedAt:Date,
    role:{
        type:String,
        enum:['admin','subadmin','superadmin','user'],
        required:[true,'please specify your role'],
        default:'user'
    },
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    review:{
        type:mongoose.Schema.ObjectId,
        ref:'Review'
    }     
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
//virtuals
userSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'user',
    localField:'_id'
})
//querymiddleware
userSchema.pre(/^find/,function(next){
    //this points to the current query
    this.find({active:{$ne:false}})
    next();
})
userSchema.pre('save',async function(next){
    //only runs this function if password was actually modified
    if(!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password=await bcrypt.hash(this.password,12);
    
    //Delete password confirm field
    this.passwordConfirm=undefined;
})
userSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew) return next()
    this.passwordChangedAt=Date.now()-1000;
    next();
})
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
};
userSchema.methods.changedPasswordAfter=function(JWTTimeStamp){
    if(this.passwordChangedAt){
        //console.log(this.passwordChangedAt,JWTTimeStamp)
        const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10)
        //console.log(changedTimeStamp,JWTTimeStamp)
        return JWTTimeStamp<changedTimeStamp
    }
    //False means not changed
    return false;
};
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    //console.log({resetToken},this.passwordResetToken);
    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;
    //10min=10*60--600s*1000=milliseconds 
    //so date.now +10m-->password expires in next 10 m of resetPassword click
}
const User=mongoose.model('User',userSchema);
module.exports=User;