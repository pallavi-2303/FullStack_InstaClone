
import SignUp from './components/ui/SignUp'
import Login from './components/ui/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/ui/MainLayout'
import Home from './components/ui/Home'
import Profile from './components/ui/Profile'
import EditProfile from './components/ui/EditProfile'
import ChatPage from './components/ui/ChatPage'
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDeferredValue } from 'react'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ui/ProtectedRoutes'

const browserRouter=createBrowserRouter([
 {
  path:"/",
  element:<ProtectedRoutes><MainLayout/></ProtectedRoutes>,

  children:[
    {
    path:"/",
    element:<ProtectedRoutes><Home/></ProtectedRoutes>
    },
    {
      path:"/profile/:id",
      element:<Profile/>
    },
    {
      path:"/account/edit",
      element:<EditProfile/>
    },
    {
      path:"/chat",
      element:<ChatPage/>
    }
  ]
 } ,
 {
path:"/login" ,
element:<Login/> 
 },
 {
  path:"/signup" ,
  element:<SignUp/> 
   },
])
function App() {
const {user}=useSelector(store=>store.auth);
const {socket}=useSelector(store=>store.socketio);
const dispatch=useDispatch();
  useEffect(()=>{
if(user){
  const socketio=io('http://localhost:8000',{
    query:{
      userId:user?._id
    },
    transports:['websocket']
  });
  dispatch(setSocket(socketio));
  //listing all the events
  socketio.on('getOnlineUsers',(onlineUsers)=>{
dispatch(setOnlineUsers(onlineUsers));
  });
  socketio.on('notification',(notification)=>{
    dispatch(setLikeNotification(notification));
  })
  return ()=>{
    socketio.close();
    dispatch(setSocket(null));
  }
} else if(socket) {
  socket?.close();
  dispatch(setSocket(null));
}
  },[user,dispatch])
  return (
    <>
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
