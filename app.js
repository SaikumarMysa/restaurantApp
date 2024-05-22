const express=require('express');
const app=express();
const morgan=require('morgan');
const adminRouter=require('./Routes/adminRoutes');
const AppError=require('./utils/appError');
const categoryRouter=require('./Routes/categoryRoutes')
const fooditemRouter=require('./Routes/fooditemRoutes');
//Global middlewares
//Development logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
//Body parser
app.use(express.json({limit:'10kb'}));
//Routes
app.use('/api/v1/admins',adminRouter);
app.use('/api/v1/categories',categoryRouter);
app.use('/api/v1/fooditems',fooditemRouter)


app.all('*',(req,res,next)=>{
 next(new AppError(`Can't find ${req.originalUrl} on this server`,400))
})

module.exports=app;