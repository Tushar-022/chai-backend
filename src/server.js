import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js';

const app=express();
app.use(cors({
    origin:process.env.CROSS_ORIGIN
}))

// setting the limit on how much data we can input in json format
app.use(express.json({
    limit:"10kb"
}))

app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// make the routes

app.get('/api',(req,res)=>{
    res.send("fkbu")
})
app.use("/api/v1/users", userRouter)
  // app.use("/api/v1", userRouter)
// here v1 represents the version of api testing

export {app};