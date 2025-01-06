import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData, selectAuth } from "../redux/authSlice";
import OnetoOneChat from "../api/OnetoOneChat";
import useDebounce from "../hook/UseDebounce";
import IUserType, { IChats } from "../types/user";

const SideBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<IUserType[] | []>([]);
  const [chats, setChats] = useState<IChats[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const dispatch = useDispatch();
  const { id } = useSelector(selectAuth);

  // Fetch all users when search is empty
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        if (debouncedSearchTerm.trim()) {
          const response = await OnetoOneChat.searchUser(debouncedSearchTerm);
          setUsers(response.data.users || []);
        } else {
          // Fetch all users when search is empty
          const response = await OnetoOneChat.searchUser("");
          setUsers(response.data.users || []);
        }
        setError(null);
      } catch (error) {
        setError("Error fetching users. Please try again.");
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearchTerm]);

  // Fetch initial chats
  useEffect(() => {
    const fetchInitialChats = async () => {
      if (!id) {
        setError("Please sign in to view your chats.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await OnetoOneChat.getChats(id);
       
        setChats(response.data[0]);
        setError(null);
      } catch (error) {
        setError("Couldn't load your chats. Please try again.");
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialChats();
  }, [id]);

  const createChat = async (receiverId: string) => {
    if (!id) {
      setError("Please sign in to start a chat.");
      return;
    }

    try {
      const response = await OnetoOneChat.createChat([receiverId, id]);
      // Refresh chats after creating a new one
      const updatedChats = await OnetoOneChat.getChats(id);
      setChats(updatedChats.data);
      setError(null);
    } catch (error) {
      setError("Couldn't create chat. Please try again.");
      console.error("Error creating chat:", error);
    }
  };

  const renderUserList = () => {
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

    const displayList = searchTerm.trim() ? users : chats;
    
    if (!displayList.length) {
      return (
        <div className="text-center text-gray-400">
          {searchTerm.trim() ? "No users found" : "No chats yet"}
        </div>
      );
    }

    return displayList.map((item: IUserType | IChats, index: number) => {
      const user = 'user' in item ? item.user : item;
         
      return (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex justify-items-start gap-2 items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
          onClick={() => searchTerm.trim() && createChat(user._id)}
        >
          <img
            src="https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png"
            alt="profile-pic"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            {user.bio && (
              <span className="text-sm text-gray-400">{user.bio}</span>
            )}
          </div>
          <div className="absolute top-1 right-1 bg-green-300 flex items-center justify-center h-5 w-5 rounded-full"></div>
        </motion.div>
      );
    });
  };

  return (
    <div className="w-1/5 min-h-screen">
      <div className="relative w-full h-full flex flex-col bg-gray-800 text-white">
        <motion.div className="flex w-full p-8">
          <span className="bg-gradient-to-r from-green-200 bg-green-500 to-green-700 bg-clip-text text-transparent text-4xl font-bold tracking-tight">
            CHATIFY
          </span>
        </motion.div>

        <div className="relative w-full px-4 pb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full p-3 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="relative flex flex-col w-full p-4 gap-4 overflow-y-auto">
          {renderUserList()}
        </div>

        <div
          className="fixed bottom-4 left-4 flex justify-items-start gap-2 items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
          onClick={() => dispatch(clearUserData())}
        >
          Sign Out
        </div>
      </div>
    </div>
  );
};

export default SideBar;