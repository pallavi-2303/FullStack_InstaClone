import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const SuggestedUser = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for You</h1>
        <span className="font-medium cursor-pointer ml-3">See All </span>
      </div>
      {suggestedUsers?.map((user) => {
        return (
          <div key={user?._id} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2 ">
              <Link to={`/profile/${user._id}`}>
                {" "}
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>{" "}
              </Link>

              <div>
                <Link to={`/profile/${user._id}`}>
                  {" "}
                  <h1 className="font-semibold text-sm">{user.userName}</h1>
                </Link>
                <span className="text-gray-600 tex-sm">
                  {user?.bio || "bio here"}
                </span>
               
              </div>
              <span className="text-[#3BADF8] text-sm font-bold cursor-pointer hover:text-[#0a85d7]  ">Follow</span>
            </div>
            
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUser;
