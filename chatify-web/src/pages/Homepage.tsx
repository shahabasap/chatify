import { useEffect, useState, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/authSlice";
import SideBar from "../layout/SideBar";

interface Message {
  chatId: string;
  sender: string |null;
  content: string;
  createdAt: Date;
  _id: string; // Add messageId for tracking
}

interface Chat {
  _id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
}

const Homepage = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userData = useSelector(selectAuth);
  const userId = userData.id;
  const messageIdsRef = useRef(new Set<string>()); // Track message IDs

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    socketRef.current = io("http://localhost:3000", {
      query: { userId },
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    // Listen for new messages
    socket.on("receiveMessage", (newMessage: Message) => {
      if (!newMessage._id) {
        newMessage._id = `${newMessage.sender}-${newMessage.createdAt}-${Math.random()}`; 
      }
      
      // Check if message is already in our tracking set
      if (!messageIdsRef.current.has(newMessage._id)) {
        messageIdsRef.current.add(newMessage._id);
        setMessages(prev => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receiveMessage");
      socket.close();
    };
  }, [userId]);

  // Clear message tracking when changing chats
  useEffect(() => {
    messageIdsRef.current.clear();
  }, [activeChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join chat room when activeChat changes
  useEffect(() => {
    if (!activeChat || !socketRef.current) return;

    socketRef.current.emit("joinChat", { chatId: activeChat }, (response: any) => {
      if (response.status === 200 && response.data) {
        // Add messageIds to tracking for existing messages
        response.data.messages?.forEach((msg: Message) => {
          if (!msg._id) {
            msg._id = `${msg.sender}-${msg.createdAt}-${Math.random()}`;
          }
          messageIdsRef.current.add(msg._id);
        });
        setMessages(response.data.messages || []);
      } else {
        console.error("Error joining chat:", response.error);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveChat", { chatId: activeChat });
      }
    };
  }, [activeChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat || !socketRef.current) return;

    const messageId = `${userId}-${new Date().toISOString()}-${Math.random()}`;
    
    const messageData = {
      chatId: activeChat,
      senderId: userId,
      message: newMessage.trim(),
      chatType: "individual",
      messageId // Include messageId in the sent message
    };
  
    // Only emit if we haven't seen this message before
    if (!messageIdsRef.current.has(messageId)) {
      socketRef.current.emit("sendMessage", messageData, (response: any) => {
        if (response.status === 200) {
          // Clear input first
          setNewMessage("");
          
          // Add message to tracking and state
          messageIdsRef.current.add(messageId);
          setMessages(prev => [...prev, {
            chatId: activeChat,
            sender: userId,
            content: newMessage.trim(),
            createdAt: new Date(),
            _id
          }]);
        } else {
          console.error("Error sending message:", response.error);
        }
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="relative h-full w-full bg-slate-950">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        </div>
      </div>

      <div className="flex h-screen">
        <SideBar onChatSelect={setActiveChat} />
        
        <div className="flex flex-col w-full text-white p-4">
          {!activeChat ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a chat to start messaging
            </div>
          ) : (
            <>
              <div className="flex-grow flex flex-col gap-4 overflow-y-auto border border-gray-700 p-4 rounded-lg bg-gray-800">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`relative group ${
                        message.sender === userId
                          ? "bg-blue-600 rounded-tr-lg rounded-tl-lg rounded-bl-lg"
                          : "bg-gray-700 rounded-tr-lg rounded-tl-lg rounded-br-lg"
                      } p-3 rounded-lg max-w-[75%]`}
                    >
                      <p className="break-words">{message.content}</p>
                      <span className="text-xs text-gray-300 mt-1 opacity-60">
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2 mt-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-grow p-3 rounded-lg border border-gray-700 bg-gray-800 text-white resize-none min-h-[50px] max-h-[150px]"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="px-6 bg-blue-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;