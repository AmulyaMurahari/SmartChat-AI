import './App.css';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';
import { useState } from 'react';

const sendMsgToOllama = async (input) => {
  const response = await fetch('http://127.0.0.1:8000/send_message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: input })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  const data = await response.json();
  return data.response;
};

function App() {
  const [input, setInput] = useState(""); 
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (input.trim() === "") return;
    const userMessage = { text: input, isUser: true };
    setMessages([...messages, userMessage]);
    setInput("");
    setError(null);
    try {
      const response = await sendMsgToOllama(input);
      const botMessage = { text: response, isUser: false };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error fetching response from Ollama:", error);
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <div className='sideBar'>
        <div className='upperSide'>
          <div className='upperSideTop'><img src={gptLogo} alt="Logo" className='logo' /><span className='brand'>SmartChatAI</span></div>
          <button className='midBtn'><img src={addBtn} alt="new chat" className='addBtn' />New Chat</button>
          <div className='upperSideBottom'>
            <button className='query'><img src={msgIcon} alt="Query" />What is Programming ?</button>
            <button className='query'><img src={msgIcon} alt="Query" />How to use an API ?</button>
          </div>
        </div>
        <div className='lowerSide'>
          <div className='listItems'><img src={home} alt=" " className="listitemsImg" />Home</div>
          <div className='listItems'><img src={saved} alt=" " className="listitemsImg" />Saved</div>
          <div className='listItems'><img src={rocket} alt=" " className="listitemsImg" />Upgrade to Pro</div>
        </div>
      </div>
      <div className='main'>
        <div className='chats'>
          {messages.map((message, index) => (
            <div key={index} className={`chat ${message.isUser ? '' : 'bot'}`}>
              <img className='chatImg' src={message.isUser ? userIcon : gptImgLogo} alt="" />
              <p className='txt'>{message.text}</p>
            </div>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
        <div className='chatFooter'>
          <div className='inp'>
            <input
              type="text"
              placeholder='Send a message'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className='send' onClick={handleSend}>
              <img src={sendBtn} alt="Send"/>
            </button>
          </div>
          <p>SmartChatAI may produce inaccurate information about people, places, or facts. SmartChatAI June 2024 Version</p>
        </div>
      </div>
    </div>
  );
}

export default App;
