import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      console.log(req.body);
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({
        success: false,
        message: "User already exist withthis emailId",
      });
    }
    //create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });
    newUser.save();
    return res.status(201).json({
      success: true,
      message: "Account created succesfully",
      newUser,
    });
  } catch (error) {
    console.log("Error while registering", error);
    return res.status(401).json({
      success: false,
      message: "Failed to register",
    });
  }
};
export  const login=async (req,res)=>{
  try {
  const {email,password} =req.body;
  if(!email || !password){
    return res.status(403).json({
      success:false,
      message:"All fields are required",
    })
  }
  //if user doest exist with email
  let user=await User.findOne({email});
  if(!user){
  return res.status(403).json({
    message:"Incorrect Email or Password",
    success:false
  }) 
  }
  const newPassword=await bcrypt.compare(password,user.password);
  if(!newPassword){
    return res.status(403).json({
      message:"Incorrect Password",
      success:false
    })
  }
  const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
  const populatedpost=await Promise.all(
    user.posts.map(async(postId)=>{
   const post=await Post.findById(postId)  ;
   if(post.author.equals(user._id)){
    return post
   }
   return null
    })
  )
  user={
    _id:user._id,
    userName:user.userName,
    email:user.email,
    following:user.following,
    followers:user.followers,
    profilePicture:user.profilePicture,
    bio:user.bio,
    posts:populatedpost
  }
  //if all the things matches

  return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
    message:`Welcome back ${user.userName}`,
    success:true,
    user
  })
  } catch (error) {
    console.log("Error while login", error);
    return res.status(401).json({
      success: false,
      message: "Failed to Login",
    
    });
  }
}
export const logout=async (__,res)=>{
  try {
  return res.cookie("token","",{maxAge:0}).json({
    message:"Logout Successfully",
    success:true
  })
  } catch (error) {
  console.log(error) ;
  return res.status(401).json({
    success: false,
    message: "Failed to Logout",
  });
  }
}
export const getAllProfiles=async(req,res)=>{
  try {
 const userId=req.params.id;
 let user= await User.findById(userId).select("-password") ;
 return res.status(200).json({
  user,
  success:true
 })
  } catch (error) {
   console.log("Error while getting all profiles");
   return res.status(403).json({
    message:"Error getting profile",
    success:false
   })
  }
}
export const getProfile=async(req,res)=>{
  try {
 const userId=req.params.id;
 let user= await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks') ;
 return res.status(200).json({
  user,
  success:true
 })
  } catch (error) {
   console.log("Error while getting  profiles",error);
   return res.status(403).json({
    message:"Error getting profile",
    success:false
   })
  }
}
export const editProfile=async(req,res)=>{
  try {
 const userId=req.id;
 const {bio,gender} =req.body;
 const profilePicture=req.file;
 let cloudResponse;
  if(profilePicture){
    const fileUri=getDataUri(profilePicture);
 cloudResponse=await cloudinary.uploader.upload(fileUri);
  }
  const user=await User.findById(userId).select("-password");
  if(!user){
    return res.status(404).json({
      message:"User not found.",
      success:false,
    })
  }
  if(bio) user.bio=bio;
  if(gender) user.gender=gender;
  if(profilePicture) user.profilePicture=cloudResponse.secure_url;
  user.save();
  return res.status(200).json({
    message:"Profile Updated Successfully.",
    success:true,
    user
  })
  } catch (error) {
   console.log("error in controller",error) 
  }
}
export const getAllSuggestedUser=async(req,res)=>{
  try {
 const suggestedUser=await User.find({_id:{$ne:req.id}}).select("-password") ;
 if(!suggestedUser){
  return res.status(404).json({
    message:"Currently donot have any user",
    success:false
  })
 }
 //if there are sugggested user
 return res.status(200).json({
  success:true,
 users: suggestedUser
 })
  } catch (error) {
  console.log("Error getting all suggested user");
  }
}
export const followOrUnfollow=async(req,res)=>{
  try{
const followkarneWala=req.id;
const jiskofollowKarega=req.params.id;
//agar dono same honge
if(followkarneWala===jiskofollowKarega){
  return res.status(403).json({
    message:"You cannot follow and unfollow yourSelf",
    success:false
  })
}
const user=await User.findById(followkarneWala);
const targetUser=await User.findById(jiskofollowKarega);
if(!user || !targetUser){
  return res.status(404).json({
    message:"User not Found.",
    success:false
  })
}
//foolow karne ka logic
const isFollowing=user.following.includes(jiskofollowKarega);
if(isFollowing){
//unfollow ke logic
await Promise.add([
  User.updateOne({_id:followkarneWala},{$pull:{following:jiskofollowKarega}}),
  User.updateOne({_id:jiskofollowKarega},{$pull:{followers:followkarneWala}})

])
return res.status(200).json({message:"Unfollow Successfully",success:true})
}
else {
//follow ka logic
await Promise.all([
  User.updateOne({_id:followkarneWala},{$push:{following:jiskofollowKarega}}),
  User.updateOne({_id:jiskofollowKarega},{$push:{followers:followkarneWala}})

])
return res.status(200).json({message:"follow Successfully",success:true})
}
}
catch(error){
  console.log(error);
}
}