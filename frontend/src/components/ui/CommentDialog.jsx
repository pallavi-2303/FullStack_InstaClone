import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { toast } from "sonner";

const CommentDialog = ({ open, setOpen }) => {
  const {selectedPost,posts}=useSelector(store=>store.post);
  const [comment,setComment]=useState([]);
  const dispatch=useDispatch();
    const [text,setText]=useState("");
  useEffect(()=>{
if(selectedPost){
  setComment(selectedPost.comments);
}
  },[selectedPost])
    const changeEventHandler=(e)=>{
        let inputText=e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }
        else {
            setText("");
        }
    }
    const sendMessageHandler=async()=>{
      try {
        const res=await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,{text},{
          headers:{
            'Content-Type':'application/json' 
          },
          withCredentials:true,
        })  
        if(res.data.success){
          const updatedCommentData=[...comment,res.data.comment];
      setComment(updatedCommentData);
      const updatedPostData=posts.map(p=>p._id===selectedPost?._id ? {...p,comments:updatedCommentData}:p)
      dispatch(setPosts(updatedPostData));
          toast.success(res.data.message);
          setText("");
        }
      } catch (error) {
       console.log(error) ;
       toast.error(error.response.data.message); 
      }
        }
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-1">   
         <div className="w-1/2"> 
        <img
            className="rounded-l-lg  w-full h-full object-cover"
            src={selectedPost?.image}
            alt="post_image"
          ></img></div>
          <div className=" w-1/2 flex flex-col justify-between">
            <div className="flex flex-row justify-between p-4">
                <div className="flex gap-3 items-center">
                <Link><Avatar>
                <AvatarImage src={selectedPost?.author?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar></Link>
              <div>
                <Link className="font-semibold text-xs">{selectedPost?.author?.userName}</Link>
            <spna className="text-gray-600 text-sm ml-4">Bio here...</spna>
              </div>
                </div>
              <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer"/>
                </DialogTrigger>
<DialogContent className="flex flex-col items-center text-center text-medium">
    <div className="cursor-pointer w-full text-[#ED4956] font-bold hover:bg-gray-100">Unfollow</div>
    <div className="cursor-pointer w-full font-bold text-gray-900 hover:bg-gray-100">Add to favourites</div>
</DialogContent>
              </Dialog>
            </div>
            <hr/>
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
            {comment.map((comment)=><Comment key={comment._id} comment={comment}/>)}   
            </div>
            <div className="p-4">
<div className="flex gap-2 items-center">
    <input value={text} onChange={changeEventHandler} type="text" placeholder="Add a Comment.." className="w-full ouline-none border text-sm border-gray-300 p-2 rounded-lg"/>
          <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline" >Send</Button> 
          </div> </div>
          </div> 
          </div>   

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDialog;
