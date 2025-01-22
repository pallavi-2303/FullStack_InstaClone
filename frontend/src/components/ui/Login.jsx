import axios from "axios";
import { Button } from "./button";
import { Input } from "./input";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const {user}=useSelector(store=>store.auth);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const onChangeHandler=(e)=>{
setInput({...input,[e.target.name]:e.target.value})
  }
  const loginHandler=async(e)=>{
e.preventDefault();
console.log(input);
try {

 const res=await axios.post("http://localhost:8000/api/v1/user/login",input,{
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true
 })   
 if(res.data.success){
  console.log(res.data.user);
  dispatch(setAuthUser(res.data.user));
 
  navigate("/")
    toast.success(res.data.message);
    setInput({
        email: "",
        password: "",
    })
 }
} catch (error) {
  console.log("Error in frontend while Login",error)  
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
      <form onSubmit={loginHandler} className="shadow-xl flex flex-col gap-5 p-8">
        <div className="my-4">
          <h1 className="font-serif text-center font-bold text-2xl">LOGO</h1>
          <p className="font-semibold text-sm">
            Login to see your friends photos and videos
          </p>
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
        <Button type="submit" className="text-xl font-bold">Login</Button>
        <span className="text-center">Already have an Account?<Link to="/signup" className="text-blue-700"> SignUp</Link></span>
      
      </form>
    </div>
  );
};

export default Login;
