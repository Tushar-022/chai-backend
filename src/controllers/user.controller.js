import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = async (req, res) => {
  res.status(200).json({
          message:"ok"
  } )

// //  1. getting the user details by destructuring the request object
//   const { fullName, email, userName, password } = req.body;

//   // 2. validation that it isnt empty
//   if (!email || !password || !fullName || !userName)
//     throw new ApiError(400, "All fields are required");

// // 3. check if user already exists
//   const existedUser = await User.findOne({
//     $or: [{ userName }, { email }],
//   });

//   if (existedUser) {
//     throw new ApiError(409, "User with email or username already exists");
//   }

//   // 4. check for images,avatar
//   const avatarLocalPath = req.files?.avatar[0]?.path;
//   const coverImageLocalPath = req.files?.coverImage[0]?.path;

//   if (!avatarLocalPath) throw new ApiError(400, "Avatar missing");

//   const avatar=await uploadOnCloudinary(avatarLocalPath);
//   const coverImage=await uploadOnCloudinary(coverImageLocalPath);

//   if (!avatar) throw new ApiError(400, "Avatar missing");

//   // 5. creating the user object
//   const newUser= await User.create({
//     fullName,
//     avatar:avatar.url,
//     coverImage:coverImage?.url || " ",
//     email,
//     password,
//     userName:userName.toLowerCase()

//   })

//   // 6.remove password and refresh token field from response
//   const createdUser=await newUser.findById(newUser._id).select(
//     " -password -refreshToken"
//   )

//   if(!createdUser)
//   {
//     throw new ApiError(500,"Something went wrong while registering the User")
//   }

//   return res.status(201).json(
//     new ApiResponse(200,createdUser,"User registerd Successfully")
//   )

};

export { registerUser };
