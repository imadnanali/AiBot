import { createRef, useState } from 'react'
import './App.css'
import Chat from './components/Chat'
import ChatWindow from './components/ChatWindow'
import SideBar from './components/SideBar'
import { MyContext } from './components/MyContext.jsx'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4())
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [isHistoryChat, setIsHistoryChat] = useState(false)

  
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    displayedMessages, setDisplayedMessages,
    isHistoryChat, setIsHistoryChat
  };

  return (
    <div className="custom-scrollbar flex overflow-y-auto">
      <MyContext.Provider value={providerValues}>
        <SideBar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

export default App
