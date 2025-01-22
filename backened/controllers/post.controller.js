import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId,io } from "../socket/socket.js";
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image) {
      return res.status(400).json({ message: "Image Required" });
    }
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
    //buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    post.save();
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "userName profilePicture",
        },
      });
      return res.status(200).json({
        message:"All posts are fethched",
        success:true,
        posts
      })
  } catch (error) {
    console.log("Error while getting all posts", error);
  }
};
export const getUserPost=async(req,res)=>{
    try {
   const authorId=req.id;
   const posts=await Post.find({author:authorId}).sort({createdAt:-1}).populate({
    path:"author",
    select:"userName,profilePicture"
   }).populate({
    path:"comments",
    sort:{createdAt:-1},
populate:{
    path:"author",
    select:"userName, profilePicture"
}
   }) 
   return res.status(200).json({
    posts,
    success:true
   })
   
    } catch (error) {
    console.log(error)    
    }
}
export const likePost=async(req,res)=>{
    try{
const likeKarneWalaKiId=req.id;
const postId=req.params.id;
//finding the posts to be liked
const post=await Post.findById(postId);
if(!post){
    return res.status(404).json({message:'Post not found',success:false})
}
//adding userid to post 
await post.updateOne({$addToSet:{likes:likeKarneWalaKiId}});
await post.save();
const user=await User.findById(likeKarneWalaKiId).select('userName profilePicture');
const postOwnerId=post.author.toString();
if(postOwnerId!==likeKarneWalaKiId){
  const notification={
    type:'like',
    userId:likeKarneWalaKiId,
    userDetails:user,
    postId,
    message:'Your post was liked'
  }
const postOwnerSocketId=getReceiverSocketId(postOwnerId);
io.to(postOwnerSocketId).emit('notification',notification);
}
return res.status(200).json({
    message:"Post Liked",
    success:true
})}
catch(error){
    console.log("Error while liking the post",error)
}
}
export const disLikePost=async(req,res)=>{
    try{
const dislikeKarneWalaKiId=req.id;
const postId=req.params.id;
//finding the posts to be liked
const post=await Post.findById(postId);
if(!post){
    return res.status(404).json({message:'Post not found',success:false})
}
//adding userid to post 
await post.updateOne({$pull:{likes:dislikeKarneWalaKiId}});
await post.save();
const user=await User.findById(dislikeKarneWalaKiId).select('userName profilePicture');
const postOwnerId=post.author.toString();
if(postOwnerId!==dislikeKarneWalaKiId){
  const notification={
    type:'dislike',
    userId:dislikeKarneWalaKiId,
    userDetails:user,
    postId,
    message:'Your post was unliked'
  }
const postOwnerSocketId=getReceiverSocketId(postOwnerId);
io.to(postOwnerSocketId).emit('notification',notification);
}
return res.status(200).json({
    message:"Post DisLiked",
    success:true
})}
catch(error){
    console.log("Error while liking the post",error)
}
}
export const addComment=async(req,res)=>{
  try {
  const commentKarneWaleKiId=req.id;
const postId=req.params.id;
const post=await Post.findById(postId);
const {text}=req.body;
if(!text) return res.status(400).json({message:"All Fields are required",success:false})
const comment=await Comment.create({
    text,
    author:commentKarneWaleKiId,
    post:postId
})
await comment.populate({path:'author',select:'userName profilePicture'});
post.comments.push(comment._id);
post.save();
return res.status(201).json({
    message:"Comment Added Successfully",
    success:true,
    comment
})
  } catch (error) {
   console.log("Error while adding Comment",error) 
  }  
}
export const getAllCommentsOfPost=async(req,res)=>{
    try {
   const postId=req.params.id;
   const comments=await Comment.find({post:postId}).populate('author' ,'userName', 'profilePicture');
   if(!comments){
    return res.status(400).json({message:"No Comments found for this post",success:false})  }
     return res.status(200).json({success:true,commentsm})
    } catch (error) {
    console.log("Error while getting the post",error) ;  
    }
}
export const deletePost=async(req,res)=>{
    try {
    const postId=req.params.id;
    const authorId=req.id;
    //deleting the post
    const post=await Post.findById(postId);
    if(!post) {
        return res.status(400).json({
            message:"Post Not Found",
            success:false
        })
    }  
    //if the user is not authrished
    if(post.author.toString()!==authorId) {
        return res.status(401).json({message:"Unauthorised User"})
    }
    //if post found delete the post
    await Post.findByIdAndDelete(postId);
    //delete the post from user also
    let user=await User.findById(authorId);
    user.posts=user.posts.filter(id=>id.toString()!==postId);
    await user.save();
    await Comment.deleteMany({post:postId});
    return res.status(200).json({
        message:"Post deleted Successfully",
        success:true
    })
    } catch (error) {
    console.log("Error while deleting the post",error) ;  
    }
}
//bookmarkde post 
export const bookMarkedPosts=async(req,res)=>{
    try {
   const postId=req.params.id;
   const authorId=req.id;
   console.log(postId);
   const post=await Post.findById(postId) ;
   if(!post)  return res.status(404).json({message:"Post Not Found",success:false}) ;
   //book mark or remove from book marked
   const user=await User.findById(authorId);
   if(user.bookmarks.includes(post._id)){
    //remove from bookmark
    await user.updateOne({$pull:{bookmarks:post._id}});
    await user.save();
    return res.status(200).json({type:"unsaved",message:"Post Bookmarked Successfully",success:true});
   }
   else {
    await user.updateOne({$addToSet:{bookmarks:post._id}});
    await user.save();
    return res.status(200).json({type:"saved",message:"Post UnBookmarked Successfully",success:true});
   }
   
    } catch (error) {
   console.log("Error while bookmarking",error)     
    }
}