import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUser from './SuggestedUser';

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div
      className="fixed right-0 top-0 w-full sm:w-[40%] md:w-[30%] lg:w-[20%] xl:w-[18%] 
                 px-4 py-6 border-l border-gray-300 bg-white h-full hidden sm:block"
    >
      {/* User Info */}
      <div className="flex items-center gap-4 mb-8">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link to={`/profile/${user?._id}`}>
            <h1 className="font-semibold text-sm">{user?.userName}</h1>
          </Link>
          <span className="text-gray-600 text-sm">{user?.bio || 'bio here'}</span>
        </div>
      </div>

      {/* Suggested Users */}
      <SuggestedUser />
    </div>
  );
};

export default RightSidebar;
