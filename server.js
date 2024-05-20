const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})
const app=require('./app');
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{

}).then(()=>
    console.log('Database connection is successful')
)
const port=process.env.PORT||3001;
const server=app.listen(port,()=>{
    console.log(`listening to port ${port}`)
}); 
