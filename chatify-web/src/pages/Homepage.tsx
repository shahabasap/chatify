import { useEffect, useState, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/authSlice";
import SideBar from "../layout/SideBar";

interface Message {
  _id: string;
  chat: string;
  senderId: string | null;
  content: string;
  createdAt: Date;
  chatType: 'individual' | 'group';
}

interface ChatData {
  chatId: string;
  senderId: string;
  message: string;
  chatType: 'individual' | 'group';
}

interface ErrorState {
  type: 'connection' | 'message' | 'join' | 'general';
  message: string;
  timestamp: Date;
}

const Homepage = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<number>();

  const userData = useSelector(selectAuth);
  const userId = userData?.id;

  const handleError = (type: ErrorState['type'], message: string) => {
    setError({
      type,
      message,
      timestamp: new Date()
    });
    
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  const initializeSocket = () => {
    try {
      socketRef.current = io("http://localhost:3000", {
        query: { userId },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      return socketRef.current;
    } catch (error) {
      handleError('connection', 'Failed to initialize socket connection');
      return null;
    }
  };

  useEffect(() => {
    if (!userId) {
      handleError('general', 'User ID is required');
      return;
    }

    const socket = initializeSocket();
    if (!socket) return;

    socket.on("connect", () => {
      setIsConnected(true);
      setIsReconnecting(false);
      setReconnectAttempts(0);
      socket.emit('chatListUpdate', userId);
    });

    socket.on("connect_error", (error) => {
      handleError('connection', `Connection error: ${error.message}`);
      setIsConnected(false);
      
      if (reconnectAttempts < 5) {
        setIsReconnecting(true);
        setReconnectAttempts(prev => prev + 1);
        reconnectTimeoutRef.current = setTimeout(() => {
          socket.connect();
        }, 2000);
      } else {
        handleError('connection', 'Maximum reconnection attempts reached');
        setIsReconnecting(false);
      }
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      handleError('connection', `Disconnected: ${reason}`);
    });

    socket.on("receiveMessage", (newMessage: Message) => {
      try {
        console.log("reciv ",newMessage)
        if (newMessage.chat === activeChat) {
          setMessages(prev => [...prev, newMessage]);
        }
      } catch (error) {
        handleError('message', 'Error processing received message');
      }
    });

    socket.on("error", (error: string) => {
      handleError('general', error);
    });

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("receiveMessage");
      socket.off("error");
      socket.close();
    };
  }, [userId, activeChat, reconnectAttempts]);

  useEffect(() => {
    if (activeChat && socketRef.current) {
      socketRef.current.emit("joinChat", { chatId: activeChat }, (response: any) => {
        if (response.status === 200) {
          setMessages(response.data.messages || []);
        } else {
          handleError('join', response.error || 'Failed to join chat');
        }
      });
    }
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !socketRef.current) {
      handleError('message', 'Invalid message or chat state');
      return;
    }

    const messageData: ChatData = {
      chatId: activeChat,
      senderId: userId!,
      message: newMessage.trim(),
      chatType: 'individual',
    };

    try {
      const messageCopy = newMessage;
      setNewMessage(""); // Optimistic update

      socketRef.current.emit("sendMessage", messageData, (response: any) => {
        if (response.status !== 200) {
          setNewMessage(messageCopy); // Restore message on error
          handleError('message', response.error || 'Failed to send message');
          
        }

      });
    } catch (error) {
      handleError('message', 'Error sending message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <SideBar userId={userId} onChatSelect={setActiveChat} />

      <div className="flex-grow flex flex-col text-white p-4">
        {/* Error Display */}
        {error && (
          <div className={`mb-4 p-3 rounded-lg ${
            error.type === 'connection' ? 'bg-red-600' :
            error.type === 'message' ? 'bg-yellow-600' :
            'bg-orange-600'
          }`}>
            {error.message}
          </div>
        )}

        {/* Reconnecting Status */}
        {isReconnecting && (
          <div className="mb-4 p-3 rounded-lg bg-blue-600">
            Reconnecting... Attempt {reconnectAttempts}/5
          </div>
        )}

        {!activeChat ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat to start messaging
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-grow flex flex-col gap-4 overflow-y-auto border border-gray-700 p-4 rounded-lg bg-gray-800">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.senderId?.toString() === userId?.toString() ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative group ${
                      message.senderId?.toString() === userId?.toString()
                        ? "bg-blue-600 rounded-tr-lg rounded-tl-lg rounded-bl-lg"
                        : "bg-gray-700 rounded-tr-lg rounded-tl-lg rounded-br-lg"
                    } p-3 rounded-lg max-w-[75%]`}
                  >
                    <p className="break-words">{message.content}</p>
                    <span className="text-xs text-gray-300 mt-1 opacity-60">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2 mt-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                className="flex-grow p-3 rounded-lg border border-gray-700 bg-gray-800 text-white resize-none min-h-[50px] max-h-[150px]"
                rows={1}
                disabled={!isConnected}
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
  );
};

export default Homepage;