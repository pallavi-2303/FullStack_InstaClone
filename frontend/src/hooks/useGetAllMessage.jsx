import { setMessages } from '@/redux/chatSlice';
import { setPosts } from '@/redux/postSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner';

const useGetAllMessage = () => {
const dispatch=useDispatch();
const {selectedUser}=useSelector(store=>store.auth);
useEffect(()=>{
const fetchAllMessage=async()=>{
try {
  const res=await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true}) 
  if(res.data.success) {
dispatch(setMessages(res.data.messages));
//console.log(res.data.posts);
toast.success(res.data.message);
  }
} catch (error) {
 // console.log(error) ;
  toast.error(error.response.data.message) ;
}
}
fetchAllMessage();
},[selectedUser])
  
}

export default useGetAllMessage