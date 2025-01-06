import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData, selectAuth } from "../redux/authSlice";
import OnetoOneChat from "../api/OnetoOneChat";
import useDebounce from "../hook/UseDebounce";
import IUserType, { IChats } from "../types/user";

interface SideBarProps {
  onChatSelect: (chatId: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onChatSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<IUserType[]>([]);
  const [chats, setChats] = useState<IChats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const dispatch = useDispatch();
  const { id } = useSelector(selectAuth);
  const [displayList, setDisplayList] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedSearchTerm.trim()) {
        setUsers([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await OnetoOneChat.searchUser(debouncedSearchTerm);
        setUsers(response.data.users || []);
        setError(null);
      } catch (error) {
        setError("Error fetching users");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await OnetoOneChat.getChats(id);
        setChats(response.data[0] || []);
        setError(null);
      } catch (error) {
        setError("Couldn't load chats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [id]);

  useEffect(() => {
    setDisplayList(searchTerm.trim() ? users : chats);
  }, [searchTerm, users, chats]);

  const handleChatSelection = async (receiverId: string) => {
    if (!id) return;
  
    try {
      let chatId;
      if (searchTerm.trim()) {
        // Creating new chat
        const response = await OnetoOneChat.createChat([receiverId, id]);
        chatId = response.data._id;
        const updatedChats = await OnetoOneChat.getChats(id);
        setChats(updatedChats.data[0] || []);
      } else {
        // For existing chats, we need to find the chat ID from the chat object
        const chat = chats.find(chat => chat.user._id === receiverId);
        chatId = chat?.chatId;
      }
  
      if (chatId) {
        setActiveChat(chatId);
        onChatSelect(chatId);
        setSearchTerm("");
      }
    } catch (error) {
      setError("Couldn't create/select chat");
    }
  };
  const renderList = () => {
    if (isLoading) {
      return <div className="text-center text-gray-400">Loading...</div>;
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="block mx-auto mt-2 text-sm text-green-500 hover:text-green-400"
          >
            Dismiss
          </button>
        </div>
      );
    }

    if (!displayList.length) {
      return (
        <div className="text-center text-gray-400">
          {searchTerm.trim() ? "No users found" : "No chats yet"}
        </div>
      );
    }

    return displayList.map((item: IUserType | IChats, index: number) => {
      const user = 'user' in item ? item.user : item;
      const itemId = user._id
      const isActive = itemId === activeChat;

      return (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative flex items-center p-4 rounded-lg cursor-pointer ${
            isActive ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => handleChatSelection(itemId)}
        >
          <img
            src="https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png"
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-3 flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            {user.bio && (
              <p className="text-sm text-gray-400 truncate">{user.bio}</p>
            )}
          </div>
          {!searchTerm.trim() && (
            <div className="absolute top-1 right-1 bg-green-300 h-5 w-5 rounded-full" />
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="w-1/5 min-h-screen">
      <div className="relative h-full flex flex-col bg-gray-800 text-white">
        <motion.div className="flex w-full p-8">
          <span className="bg-gradient-to-r from-green-200 via-green-500 to-green-700 bg-clip-text text-transparent text-4xl font-bold">
            CHATIFY
          </span>
        </motion.div>

        <div className="px-4 pb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full p-3 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {renderList()}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="m-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
          onClick={() => dispatch(clearUserData())}
        >
          Sign Out
        </motion.div>
      </div>
    </div>
  );
};

export default SideBar;