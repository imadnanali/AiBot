import './App.css'
import Chat from './components/Chat'
import ChatWindow from './components/ChatWindow'
import SideBar from './components/SideBar'

function App() {

  return (
    <div className="bg-black flex">
      <ChatWindow />
      <SideBar />
      <Chat />
    </div>
  )
}

export default App
