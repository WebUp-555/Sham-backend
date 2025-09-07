import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exists:username,email
    //check for images,check for avatar
    //upload images to cloudinary,avator
    // create user object - create entry in db
    //remove password and refresh token field from response
    // check for user creation
    //return response

  const { fullname, email, username, password } = req.body;
  console.log("email: ", email);

  if(
    [fullname,email,username,password].some((field)=>field?.trim() === "")
  ){
    throw new ApiError(400,"All fields are required")
  }

  /*if(fullname === ""){
    throw new ApiError(400,"fullname is required")
  }*/

   const existedUser= User.findOne({
      $or: [{username},{email}]
    })
    if(existedUser){
      throw new ApiError(409,"User already exists with this username/email")
    }

    const avatarLocalpath=req.files?.avatar?.[0]?.path;
    const coverImageLocalpath=req.files?.coverImage?.[0]?.path;

    if(!avatarLocalpath){
      throw new ApiError(400,"Avatar is required")
    }
    
    const avatar=await uploadOnCloudinary(avatarLocalpath)
    const coverImage=await uploadOnCloudinary(coverImageLocalpath)

    if(!avatar){
      throw new ApiError(400,"Avatar is required")
    }

    const user= await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      username:username.toLowerCase(),
      password
    })
    const createdUser= await User.findById(user._id).select("-password -refreshToken")
    
    if(!createdUser){
      throw new ApiError(500,"Something went wrong while registering user")
    }

    return res.status(201).json(
      new ApiResponse(201,createdUser,"User has been registered successfully")
    );

});

export { registerUser };