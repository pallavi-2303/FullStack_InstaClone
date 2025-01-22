import { setUserProfile } from '@/redux/authSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const useGetUserProfile = (userId) => {
const dispatch=useDispatch();
  useEffect(()=>{
 const fetchAllUserProfile=async()=>{
try {
 const res= await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`,{withCredentials:true})  
 if(res.data.success){
    console.log(res.data.user);
    dispatch(setUserProfile(res.data.user));

 }
} catch (error) {
 console.log("Error while getting User Profile",error) ;
 toast.error(error.response.data.message);
}
  } 
  fetchAllUserProfile();
  },[userId])
}

export default useGetUserProfile