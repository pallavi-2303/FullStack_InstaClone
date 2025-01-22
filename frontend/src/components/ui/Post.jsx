import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./badge";
const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  console.log(posts);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment,setComment]=useState(post.comments)
  const dispatch = useDispatch();
 //console.log(user);
  const onChangeHandler = (e) => {
    let inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText); //kuch hoga to bhar nhi to khali bhar do
    } else {
      setText("");
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPosts = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const likeDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${action}/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
     // console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const commentHandler=async()=>{
try {
  const res=await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`,{text},{
    headers:{
      'Content-Type':'application/json' 
    },
    withCredentials:true,
  })  
  if(res.data.success){
    const updatedCommentData=[...comment,res.data.comment];
setComment(updatedCommentData);
const updatedPostData=posts.map(p=>p._id==post._id ? {...p,comments:updatedCommentData}:p)
dispatch(setPosts(updatedPostData));
    toast.success(res.data.message);
    setText("");
  }
} catch (error) {
 //console.log(error) ;
 toast.error(error.response.data.message); 
}
  }
  const bookMarkHandler=async()=>{
    
    try {
   const res=await axios.get(`http://localhost:8000/api/v1/post/${post._id}/bookmark`,{withCredentials:true})   
   if(res.data.success){
    console.log("bookmark clicked")
    toast.success(res.data.message);
   }
    } catch (error) {
     console.log(error) ;
     toast.error(error.response.data.message);
    }
  }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex items-center gap-2 ">
          <Avatar className="w-6 h-6">
            <AvatarImage src={post.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className=" flex items-center gap-3"> <h1>{post.author.userName}</h1>
   {user._id===post?.author?._id &&   <Badge variant="secondary">Author</Badge> }     
          </div>
         
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
          post?.author?._id!==user?._id  &&  <Button
          variant="ghost"
          className="cursor-pointer w-fit text-[#ED4956] font-bold"
        >
          Unfollow
        </Button>
            }
           
            <Button variant="ghost" className="cursor-pointer w-fit  font-bold">
              Add to favourites
            </Button>
            {user && user?._id === post.author._id && (
              <Button
                variant="ghost"
                onClick={deletePostHandler}
                className="cursor-pointer w-fit  font-bold"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post?.image}
        alt="post_image"
      ></img>

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeDislikeHandler}
              size={"26px"}
              className="cursor-pointe text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeDislikeHandler}
              size={"26px"}
              className="cursor-pointer "
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true)}}
            size={"26px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send size={"26px"} className="cursor-pointer hover:text-gray-600" />
        </div>

        <Bookmark
          size={"26px"}
          onClick={bookMarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <span className="text-lg font-medium mb-2 block text-red-600">
        {postLike} likes
      </span>
      <p>
        <span className="font-medium mr-2">{post.author?.userName}</span>
        {post?.caption}
      </p>
      {comment.length > 0 &&  ( <span
        className="cursor-pointer text-gray-600 hover:text-gray-600"
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true)}}
      >
        View all {post?.comments?.length} Comments
      </span>) }
    
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex">
        <input
          type="text"
          value={text}
          onChange={onChangeHandler}
          placeholder="Add a Comment"
          className="outline-none text-sm w-full"
        />
        {text && <span onClick={commentHandler}   className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
