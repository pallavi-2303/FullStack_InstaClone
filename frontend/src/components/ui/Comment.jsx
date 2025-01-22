import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'
    >
        <div className='flex gap-3 items-center'>
            <Avatar>
                <AvatarImage src={comment?.author?.profilePicture}/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm'>{comment?.author?.userName}</h1> <span className='font-medium pl-1'>{comment?.text}</span>
        </div>
    </div>
  )
}

export default Comment