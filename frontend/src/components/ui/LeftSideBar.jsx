import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Menu,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";

const LeftSideBar = () => {
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const createPostHandler = () => {
    setOpen(true);
  };

  const sidebarHandler = async (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      createPostHandler();
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebar = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed left-0 border-r border-gray-300 w-[75%] sm:w-[60%] md:w-[30%] lg:w-[18%] top-0 z-10 h-screen shadow-lg hidden md:block">
        <div className="flex flex-col px-2 md:px-4">
          <h1 className="my-4 md:my-8 pl-2 md:pl-3 text-lg md:text-xl font-bold">LOGO</h1>
          {sidebar.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              className="flex gap-2 md:gap-3 items-center my-2 md:my-3 relative hover:bg-gray-300 cursor-pointer rounded-lg p-2 md:p-3"
              key={index}
            >
              <span>{item.icon}</span>
              <span className="text-base md:text-lg font-semibold">{item.text}</span>
              {item.text === "Notifications" && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="rounded-full h-4 w-4 md:h-5 md:w-5 bg-red-600 hover:bg-red-600 absolute bottom-4 md:bottom-6 left-4 md:left-6"
                      size="icon"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      {likeNotification.length === 0 ? (
                        <p>No new Notification</p>
                      ) : (
                        likeNotification.map((notification) => (
                          <div
                            className="flex items-center gap-2 my-2"
                            key={notification?.userId}
                          >
                            <Avatar>
                              <AvatarImage
                                src={notification?.userDetails?.profilePicture}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-xs md:text-sm mr-1">
                              <span className="font-bold">
                                {notification?.userDetails?.profilePicture}{" "}
                              </span>
                              Liked your post
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
        <CreatePost open={open} setOpen={setOpen} />
      </div>

      {/* Mobile Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-20 md:hidden">
        <div className="flex justify-around items-center py-3">
          {sidebar.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex flex-col items-center cursor-pointer"
            >
              <span>{item.icon}</span>
              <span className="text-xs">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;
