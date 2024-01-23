import mongoose from 'mongoose';
//import { DB_NAME } from '../constants.js';

const connectDB=async()=>{
    try{
           const connection= await mongoose.connect(`${process.env.MONGODB_URI}`);
           console.log(`Connected Successfully on port ${process.env.PORT} ` );

    }catch(error){
        console.log('Error while connecting to the database ', error);
        process.error(1);
    }
}

export default connectDB;