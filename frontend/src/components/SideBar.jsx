import React, { useEffect } from "react";
import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from 'uuid';

const SideBar = () => {
  const { allThreads, setAllThreads, currThreadId, setReply, setPrompt, setCurrThreadId, setPrevChats, setNewChat, setIsHistoryChat } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/thread");
      const res = await response.json();
      const filterData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
      setAllThreads(filterData)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllThreads();
  }, [currThreadId])

  const createNewChat = () => {
    setPrompt("")
    setReply(null)
    setCurrThreadId(uuidv4());
    setPrevChats([]);
    setNewChat(true)
  }


  const getPrevThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`http://localhost:8000/api/thread/${newThreadId}`);
      const res = await response.json();
      console.log(res)
      setPrevChats(res);
      setNewChat(false)
      setReply(null)
      setIsHistoryChat(true);
    } catch (err) {
      console.log(err)
    }
  }

  const deleteThread = async (threadId) => {
    const answer = confirm('Are you sure? you want to delete Thread?')
    answer == true ?
      await fetch(`http://localhost:8000/api/thread/${threadId}`, { method: 'DELETE' },
        setAllThreads((prev) => prev.filter(thread => thread.threadId !== threadId)))
        .then(threadId === currThreadId && createNewChat)
        .then(res => res.json()).then(data => console.log(data))
        .catch(err => console.log(err, "Thread not Deleted")
        ) : console.log("Thread not deleted — user cancelled.");
  }


  return (
    <div className="h-screen w-64 bg-[#111111] text-gray-200 flex flex-col border-r border-gray-800">
      {/* Header / Logo */}
      <div className="py-3 flex items-center gap-44 border-b border-gray-800" onClick={createNewChat}>
        <img
          src="./src/assets/blacklogo.png"
          alt="AiBot logo"
          className="invert brightness-200 h-6"
        />
        <i className="fa-solid fa-pen-to-square h-6"></i>
      </div>

      <div className="p-3">
        <button
          onClick={createNewChat}
          className="flex items-center justify-center gap-2 w-full bg-[#1a1a1a] cursor-pointer hover:bg-[#2a2a2a]  text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 shadow-sm border border-gray-700"
        >
          <svg
            className="w-5 h-5"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Chat
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900'>
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Today
          </div>
          <ul className="space-y-1">
            {allThreads?.map((thread, index) => (
              <li key={index} onClick={(e) => {
                getPrevThread(thread.threadId);
                setCurrThreadId(thread.threadId)
              }}>
                <button className={`w-full text-left flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#1e1e1e] transition-all duration-150 group ${currThreadId === thread.threadId && "bg-[#1e1e1e]"}`}  >
                 
                  <span className="text-sm text-gray-300 truncate flex-1">
                    {thread.title}
                  </span>
                  
                  <i className="fa-solid fa-trash opacity-0 group-hover:opacity-100 hover:text-red-600" onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="p-1 ps-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1e1e1e] transition-all duration-150 cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
            AA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Adnan Ali
            </p>
            <p className="text-xs text-gray-400 truncate">Free Account</p>
          </div>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SideBar;