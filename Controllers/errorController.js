const AppError=require('./../utils/appError');
const handleCastErrorDB = err =>{
    const message= `Invalid ${err.path}:${err.value}`;
    return new AppError(message,400)
}
const handleDuplicateFieldsDB= err =>{
    const fieldName=Object.keys(err.keyValue)[0];
    const fieldValue=err.keyValue[fieldName];
    const message=`Duplicate field value:${fieldvalue}.Please use another value`;
    return new AppError(message, 400)
}
const handleValidationErrorDB=err =>{
    const errors =Object.values(err.errors).map(el=>el.message)
    const message=`Invalid input data:${errors.join('.')}`;
    return new AppError(message, 400);
}
const handleJsonWebTokenError= err =>{
    const message ='Invalid token, please login again'
    return new AppError(message,401)
}
const handleJWTExpiredError= err =>{
    const messsage ='Token has expired'
    return new AppError(message,401)
}
const sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stackTrace:err.stack
    })
}
const sendErrorProd=(err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }
    else{
        console.log('Error');
        res.status(err.statusCode).json({
            status:'error',
            message:'Something went wrong'
        })
    }
}
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error';
    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,res)
    }else if(process.env.NODE_ENV==='production'){

        let error={...err};
        if (err.name==='CastError')  error = handleCastErrorDB(error)
        
        if(err.code===11000) error = handleDuplicateFieldsDB(error)

        if(err.name==='ValidationError') error = handleValidationErrorDB(error)

        if(err.name==='JsonWebTokenError') error = handleJsonWebTokenError(error)

        if(err.name==='TokenExpiredError') error = handleJWTExpiredError()
        
        sendErrorProd(error,res)
    }else{
        res.status(500).json({
            status:'error',
            message:'something went wrong'
        })
    }
}
