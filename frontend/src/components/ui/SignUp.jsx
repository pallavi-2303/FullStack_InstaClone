import axios from "axios";
import { Button } from "./button";
import { Input } from "./input";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SignUp = () => {
  const {user}=useSelector(store=>store.auth);
  const [input, setInput] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);
  const onChangeHandler=(e)=>{
setInput({...input,[e.target.name]:e.target.value})
  }
  const signupHandler=async(e)=>{
e.preventDefault();
console.log(input);
try {
    setLoading(true)
 const res=await axios.post("http://localhost:8000/api/v1/user/register",input,{
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true
 })   
 if(res.data.success){
  navigate("/login");
    toast.success(res.data.message);
   
    setInput({
        userName: "",
        email: "",
        password: "",
    })
 }
} catch (error) {
  console.log("Error in frontend while registering",error)  
  toast.error(error.response.data.message)
} finally{
    setLoading(false)
}
  }
   useEffect(()=>{
  if(user){
    navigate("/")
  }
    },[])
  return (
    <div className="flex items-center justify-center w-screen h-screen ">
      <form onSubmit={signupHandler} className="shadow-xl flex flex-col gap-5 p-8">
        <div className="my-4">
          <h1 className="font-serif text-center font-bold text-2xl">LOGO</h1>
          <p className="font-semibold text-sm">
            Sign Up to see your friends photos and videos
          </p>
        </div>
        <div>
          <span className="font-semibold text-xl">UserName:</span>
          <Input
            type="text"
            name="userName"
            value={input.userName}
            onChange={onChangeHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-semibold text-xl">Email:</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={onChangeHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-semibold text-xl">Password:</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={onChangeHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <Button type="submit" className="text-xl font-bold">SignUp</Button>
     <span className="text-center">Already have an Account?<Link to="/login" className="text-blue-700"> Login</Link></span>
      </form>
    </div>
  );
};

export default SignUp;
