import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import VideoChat from './VideoChat';
import Whiteboard from './Whiteboard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const messagesEndRef = useRef(null);
  const username = location.state?.username;

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    // Here you would typically connect to your real-time backend (e.g., WebSocket)
    setUsers(prevUsers => [...prevUsers, username]);
    addSystemMessage(`${username} joined the room`);

    return () => {
      // Cleanup: remove user when component unmounts (user leaves room)
      setUsers(prevUsers => prevUsers.filter(user => user !== username));
      addSystemMessage(`${username} left the room`);
    };
  }, [username, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addSystemMessage = (text) => {
    setMessages(prevMessages => [...prevMessages, { type: 'system', text, timestamp: new Date() }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, { type: 'user', sender: username, text: inputMessage, timestamp: new Date() }]);
      setInputMessage('');
    }
  };

  const handleLeaveRoom = () => {
    navigate('/');
  };

  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
  };

  if (!username) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen">
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow">
          <VideoChat roomId={roomId} username={username} />
        </div>
        {showWhiteboard && (
          <div className="h-1/3">
            <Whiteboard roomId={roomId} username={username} />
          </div>
        )}
        <Button onClick={toggleWhiteboard} className="mt-2">
          {showWhiteboard ? 'Hide Whiteboard' : 'Use Whiteboard'}
        </Button>
      </div>
      <div className="w-1/4 flex flex-col p-4 border-l">
        <h2 className="text-2xl font-bold mb-4">Room: {roomId}</h2>
        <div className="flex-grow bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.type === 'system' ? 'text-gray-500' : ''}`}>
              <span className="text-xs text-gray-400">{msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
              {msg.type === 'user' && <span className="font-bold ml-2">{msg.sender}:</span>}
              <span className="ml-2">{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex mb-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2"
            placeholder="Type a message..."
          />
          <Button type="submit">Send</Button>
        </form>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Users in Room</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
        <Button onClick={handleLeaveRoom} variant="destructive">Leave Room</Button>
      </div>
    </div>
  );
};

export default ChatRoom;
