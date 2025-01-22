import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./button";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [input,setInput]=useState({
   profilePicture:user?.profilePicture,
   bio:user?.bio,
   gender:user?.gender,
  })
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const fileChangeHandler=async(e)=>{
    const file=e.target.files?.[0];
    if(file) setInput({...input,profilePicture:file});
  }
  const selectChangeHandler=async(value)=>{
setInput({...input,gender:value});
  }
  const editProfileHandler = async () => {
const formData=new FormData();
formData.append("bio",input.bio);
formData.append("gender",input.gender);
if(input.profilePicture) formData.append("profilePicture",input.profilePicture);

    try {
    setLoading(true);
    const res=await axios.post('https://fullstack-instaclone.onrender.com/api/v1/user/profile/edit',formData,{
        headers:{
      'Content-Type':'multipart/form-data'      
        },
        withCredentials:true
    });
    if(res.data.success){
    const updatedUser={
        ...user,
        bio:res.data.user?.bio,
        gender:res.data.user?.gender,
        profilePicture:res.data.user?.profilePicture
    }
    dispatch(setAuthUser(updatedUser));
    navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
    }
    } catch (error) {
        console.log(error);
    } finally{
        setLoading(false);
    }
  };
  return (
    <div className="flex max-w-2xl pl-10 mx-auto">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between gap-2 bg-gray-100 rounded-xl p-4 ">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-bold text-sm">{user?.userName}</h1>
              <span className="text-gray-600 tex-sm">
                {user?.bio || "bio here"}
              </span>
            </div>
          </div>
          <input onChange={fileChangeHandler} ref={imageRef} type="file" className="hidden" />
          <Button
            onClick={() => imageRef?.current.click()}
            className="bg-[#0095F6] hover:bg-[#3199df] h-8"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea value={input.bio} onChange={(e)=>setInput({...input,bio:e.target.value})} name="bio" className=" focus-visible:ring-transparent" />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-[#0095F6] hover:bg-blue-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button onClick={editProfileHandler} className="w-fit bg-[#0095F6] hover:bg-blue-500">
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
