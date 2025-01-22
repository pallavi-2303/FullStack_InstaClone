import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./input";
import { Button } from "./button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { toast } from "sonner";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const sendMessageHandler = async (receiverId) => {
    console.log(textMessage);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log(res);
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
    
       // toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error in chat", error);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);
  return (
    <div className="flex ml-[20%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.userName}</h1>
        <hr className="mb-4 border-gray-300"></hr>
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray cursor-pointer"
                key={suggestedUser?._id}
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col ">
                  <span className="font-bold ">{suggestedUser?.userName}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10 items-center">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.userName}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages"
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-bold text-xl">Your Messages</h1>
          <span>Send a Message to start a Chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
