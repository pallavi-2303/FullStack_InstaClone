import { setSuggestedUsers } from '@/redux/authSlice';
import { setPosts } from '@/redux/postSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner';

const useSetSuggestedUsers = () => {
const dispatch=useDispatch();
useEffect(()=>{
const fetchAllPost=async()=>{
try {
  const res=await axios.get("https://fullstack-instaclone.onrender.com/api/v1/user/suggested",{withCredentials:true}) 
  if(res.data.success) {
dispatch(setSuggestedUsers(res.data.users));

console.log(res.data.users);
toast.success(res.data.message);
  }
} catch (error) {
  console.log(error) ;
  toast.error(error.response.data.message) ;
}
}
fetchAllPost();
},[])
  
}

export default useSetSuggestedUsers