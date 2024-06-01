const express=require('express');
const app=express();
const morgan=require('morgan');
const userRouter=require('./Routes/userRoutes');
const AppError=require('./utils/appError');
const categoryRouter=require('./Routes/categoryRoutes')
const fooditemRouter=require('./Routes/fooditemRoutes');
const cartRouter=require('./Routes/cartRoutes');
const orderRouter=require('./Routes/orderRoutes')
const reviewRouter=require('./Routes/reviewRoutes');
const paymentRouter=require('./Routes/paymentRoutes');
const globalErrorHandler=require('./Controllers/errorController')
//Global middlewares
//Development logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
//Body parser
app.use(express.json({limit:'10kb'}));
app.use('/api/v1/users',userRouter);
app.use('/api/v1/categories',categoryRouter);
app.use('/api/v1/fooditems',fooditemRouter)
app.use('/api/v1/cart',cartRouter)
app.use('/api/v1/order',orderRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/payment',paymentRouter)

app.all('*',(req,res,next)=>{
 next(new AppError(`Can't find ${req.originalUrl} on this server`,400))
})

//global error handler
app.use(globalErrorHandler);
module.exports=app;