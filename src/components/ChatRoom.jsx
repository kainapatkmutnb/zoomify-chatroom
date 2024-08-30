import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import VideoChat from './VideoChat';
import Whiteboard from './Whiteboard';

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Here you would typically connect to your real-time backend (e.g., WebSocket)
    // For this example, we'll simulate joining a room
    const username = prompt("Enter your username:");
    if (username) {
      setUsers(prevUsers => [...prevUsers, username]);
      addSystemMessage(`${username} joined the room`);
    }

    return () => {
      // Cleanup: remove user when component unmounts (user leaves room)
      setUsers(prevUsers => prevUsers.filter(user => user !== username));
      addSystemMessage(`${username} left the room`);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addSystemMessage = (text) => {
    setMessages(prevMessages => [...prevMessages, { type: 'system', text, timestamp: new Date() }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, { type: 'user', text: inputMessage, timestamp: new Date() }]);
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-4">Room: {roomId}</h2>
      <div className="flex-grow flex">
        <div className="w-3/4 pr-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.type === 'system' ? 'text-gray-500' : ''}`}>
                <span className="text-xs text-gray-400">{msg.timestamp.toLocaleTimeString()}</span>
                <span className="ml-2">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow mr-2 p-2 border rounded"
              placeholder="Type a message..."
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
          </form>
        </div>
        <div className="w-1/4">
          <h3 className="text-xl font-semibold mb-2">Users in Room</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <VideoChat roomId={roomId} />
      </div>
      <div className="mt-4">
        <Whiteboard roomId={roomId} />
      </div>
    </div>
  );
};

export default ChatRoom;