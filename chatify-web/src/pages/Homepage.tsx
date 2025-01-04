import { useEffect, useState } from "react";
import SideBar from "../layout/SideBar";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/authSlice";

interface Message {
  chatId: string;
  senderId: string;
  message: string;
}

interface JoinChatResponse {
  status: number;
  data?: Message[];
  error?: string;
}

interface SendMessageResponse {
  status: number;
  message?: string;
  error?: string;
}

// Initialize socket connection
const socket: Socket = io("http://localhost:3000");

const Homepage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const userData=useSelector(selectAuth)
  const userId = userData.id ? userData.id  :''

  useEffect(() => {
    // Join chat room on mount
    socket.emit("joinChat", { userId }, (response: JoinChatResponse) => {
      if (response.status === 200 && response.data) {
        setMessages(response.data);
      } else {
        console.error(response.error);
      }
    });

    // Listen for new messages
    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const chatId = "chat123"; // Replace with dynamic chat ID
      const senderId = userId;

      socket.emit(
        "sendMessage",
        { chatId, senderId, message: newMessage },
        (response: SendMessageResponse) => {
          if (response.status === 200) {
            setNewMessage("");
          } else {
            console.error(response.error);
          }
        }
      );
    }
  };

  return (
    <div>
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="relative h-full w-full bg-slate-950">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>
      </div>
      <div className="flex">
        <SideBar />
        <div className="flex flex-col w-full text-white p-4">
          <div className="flex-grow flex flex-col gap-4 overflow-y-auto border p-4 rounded-md bg-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`bg-gray-600 text-white p-2 rounded-lg inline-block max-w-[75%] ${
                    message.senderId === userId
                      ? "rounded-tl-lg rounded-bl-lg rounded-br-none"
                      : "rounded-tr-lg rounded-br-lg rounded-bl-none"
                  }`}
                >
                  {message.message}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-grow p-2 rounded-md border bg-gray-700 text-white"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 rounded-md text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
