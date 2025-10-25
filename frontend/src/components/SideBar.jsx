import React from "react";

const SideBar = () => {
  const chatHistory = [
    "How to learn React?",
    "JavaScript best practices",
    "Tailwind CSS tips",
    "Project ideas for beginners",
    "AI development trends",
  ];

  return (
    <div className="h-screen w-64 bg-[#111111] text-gray-200 flex flex-col border-r border-gray-800">
      {/* Header / Logo */}
      <div className="py-4 flex items-center gap-44 border-b border-gray-800">
        <img
          src="./src/assets/blacklogo.png"
          alt="AiBot logo"
          className="invert brightness-200 h-6"
        />
        <i className="fa-solid fa-pen-to-square h-6"></i>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button className="flex items-center justify-center gap-2 w-full bg-[#1a1a1a] cursor-pointer hover:bg-[#2a2a2a] text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 shadow-sm border border-gray-700">
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
            {chatHistory.map((chat, index) => (
              <li key={index}>
                <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#1e1e1e] transition-all duration-150 group">
                  <svg
                    className="w-4 h-4 text-gray-500 group-hover:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span className="text-sm text-gray-300 truncate flex-1">
                    {chat}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
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
