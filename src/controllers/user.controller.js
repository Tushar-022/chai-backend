import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken";

//  it implicitly has access to req and res objects without explicitly importing Express, 
//thanks to the fact that it's used in the context of an Express application.


const generateAccessAndRefreshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      //console.log(user);
      const accessToken =  user.generateAccessToken()
      //console.log(accessToken);
      const refreshToken = user.generateRefreshToken()
      //console.log(accessToken);
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler (async(req, res) => {
 
//  1. getting the user details by destructuring the request object
   const { fullName, email, userName, password } = req.body;

  // 2. validation that it isnt empty
  if (!email || !password || !fullName || !userName)
    throw new ApiError(400, "All fields are required");

// 3. check if user already exists
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }]
})

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // 4. check for images,avatar
  //console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
 
  //console.log(avatarLocalPath);
  //console.log(coverImageLocalPath);
  if (!avatarLocalPath.trim()) throw new ApiError(400, "Avatar missing");
  
  const avatar=await uploadOnCloudinary(avatarLocalPath);
  const coverImage=await uploadOnCloudinary(coverImageLocalPath);

  //console.log(avatar);

  if (!avatar) throw new ApiError(400, "Avatar missing");

  // 5. creating the user object
  const newUser= await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || " ",
    email,
    password,
    userName:userName.toLowerCase()

  })

  await newUser.save();

  // 6.remove password and refresh token field from response
  const createdUser=await User.findById(newUser._id).select(
    " -password -refreshToken"
  )

  if(!createdUser)
  {
    throw new ApiError(500,"Something went wrong while registering the User")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registerd Successfully")
  )

})

const loginUser=asyncHandler(async(req,res)=>{

  const {userName,email,password}=req.body;

  if(!userName && !email)
  {
     throw new ApiError(400,"userName or email is required")
  }

  const user=await User.findOne({
    $or:[{userName},{email}]
  })

  if(!user)
  throw new ApiError("404","User doesnt exist")

  const isPasswordValid=await user.isPasswordCorrect(password);

  if(!isPasswordValid)
  throw new ApiError("401","Invalid User Credentials")

  // userId pass krdi and destructure krke accessToken and refreshToken access krliye
   const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

   // ab tak mai 'user' object  se sb access krva rha tha but usme unwanted fields bhi hai
   // and usme ab tak refresh Token bhi set nhi hai so ek baar vapis db mai query maarni pdegi
   const loggedInUser=await User.findById(user._id).select(
    "-password -refreshToken"
   );

   const options={

        httpOnly:true,
        secure:true
   }

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
        new ApiResponse(
          200,{
            // means agr user localStorage mai cookies save krna chahta hai toh
            user:loggedInUser,accessToken,refreshToken
          },
          " User logged in Successfully"
        )
   )

          // logout krte time refresh and cookies reset krni pdegi 
          // and apne paas na userName hai and na hi password so logout krvaane ke liye middle ware use krenge
   const logoutUser=asyncHandler(async(req,res,next)=>{



   })

   // ab thode fields jo logged user ko nhi bhejne vo hta do




});

const logoutUser=asyncHandler(async(req,res) => {
  // logout krte time uska refresh token htana hai 
      await User.findByIdAndUpdate(
          req.user._id,
          {
            // is operator se mongo mai jo bhi update krna hai vo krlo
             $set:
                  {
                      refreshToken:undefined
                  } ,

          },
          //When new is set to true, the method returns the updated document after applying the changes.
          // If new is set to false (or omitted), it returns the original document before the update.
          {
            new: true
          }

      )
        
      // cookie clear krdi
      const options={
        httpOnly:true,
        secure:true
      }

      return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(200, { },"User Logged Out"))
})

// ek endpoint bna rhe hai jha se user apan refreshToken access kr ske
const refreshAccessToken=asyncHandler(async(req,res)=>{
// cookies se refreshToken access kr rahe hai
  const incomingRefreshToken=req.cookies.refreshToken|| req.body.refreshToken

  if(incomingRefreshToken)
  throw new ApiError(401,"unauthorized error")
  
  // user ke paas encrypted token pahunch ta hai 
  const decodedToken=jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  )

  const user =await User.findById(decodedToken?._id)
  if(!user)
    throw new ApiError(401,"Invalid refresh Token")

    if(incomingRefreshToken!==user?.refreshToken)
    {
      throw new ApiError(401,"Refresh Token expired or used")
    }

})




export { registerUser,loginUser,logoutUser };
