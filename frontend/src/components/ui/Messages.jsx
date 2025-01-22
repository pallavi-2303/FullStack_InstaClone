import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Link } from 'react-router-dom'
import { Button } from './button'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({selectedUser}) => {
  useGetRTM();
  useGetAllMessage();
  const {messages}=useSelector(store=>store.chat);
  const {user}=useSelector(store=>store.auth);
  return (
    <div className='overflow-y-auto flex-1 p-4'>
<div className='flex justify-center'>
    <div className='flex flex-col justify-center items-center'><Avatar className="h-20 w-20">
    <AvatarImage src={selectedUser?.profilePicture}/>
    <AvatarFallback>CN</AvatarFallback>
</Avatar>
<span>{selectedUser?.userName}</span>
<Link to={`/profile/${selectedUser?._id}`}><Button variant="secondary" className="h-8 my-2">View Profile</Button></Link>
</div>

</div>
<div className='flex flex-col gap-3'>
    {
messages &&  messages.map((message)=>{
    return (
      <div  className={`flex ${message?.senderId===user?._id ? 'justify-end' :'justify-start'}`}>
        <div className={`p-2 rounded-lg max-w-sx break-words ${message?.senderId===user?._id ? 'bg-blue-500 text-white font-semibold text-xm' : 'bg-gray-300 text-black font-semibold text-sm'}`}>
{message.message}
        </div></div>
    )
 })
    }
   
</div>
    </div>
  )
}

export default Messages