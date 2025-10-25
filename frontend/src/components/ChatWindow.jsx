import React, { useContext, useState } from "react";
import Chat from "./Chat";
import { MyContext } from "./MyContext.jsx";

const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const { prompt, setPrompt, reply, setReply, currThreadId } = useContext(MyContext);

  const getReply = async () => {
    console.log("Message:", prompt, "ThreadId :", currThreadId)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: prompt,
        threadId: currThreadId
      })
    }
    try {
      setPrompt('')
      const response = await fetch("http://localhost:8000/api/chat", options)
      const res = await response.json(); 
      setReply(res.reply)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0d0d0d] text-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-[10px] border-b border-gray-800 bg-[#111111]">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-wide">AiBot</h1>
          <svg
            className="h-4 text-gray-500"
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

        <button className="p-2 rounded-lg hover:bg-[#1e1e1e] transition-colors">
          <svg
            className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
      </header>

      {/* Chat Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center text-center h-full">
          <div className="max-w-xl">
            <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <img
                src="./src/assets/blacklogo.png"
                alt="AI Bot logo"
                className="invert h-8"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Where should we begin?
            </h2>
            <p className="text-gray-400 text-base mb-8">
              Ask me anything and I’ll help you find the answers you need.
            </p>
          </div>
        </div>

        <Chat />
      </main>

      {/* Chat Input */}
      <footer className="border-t border-gray-800 bg-[#111111] p-4">
        <div className="max-w-3xl mx-auto w-full">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e)=> e.key === 'Enter'? getReply() : ''}
              className="w-full bg-[#1a1a1a] text-gray-200 rounded-2xl py-4 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
              {/* Plus Icon (always visible) */}
              <button className="p-2 text-gray-400 hover:text-white hover:bg-[#222222] rounded-lg transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
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
              </button>

              {/* Send Icon (only visible if message is not empty) */}
              <button className="p-2 text-blue-500 hover:text-blue-400 hover:bg-[#222222] rounded-lg transition-all duration-200" onClick={getReply}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>

            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            AiBot can make mistakes. Consider checking important information.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
