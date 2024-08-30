import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Index = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [username, setUsername] = useState('');
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (newRoomName.trim() && username.trim()) {
      const newRoom = { id: `room-${Date.now()}`, name: newRoomName.trim() };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      navigate(`/room/${newRoom.id}`, { state: { username } });
    } else {
      toast.error('Please enter both a room name and a username.');
    }
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleJoinRoom = (roomId) => {
    if (username.trim()) {
      navigate(`/room/${roomId}`, { state: { username } });
    } else {
      toast.error('Please enter a username before joining a room.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      <Button onClick={toggleTheme} className="absolute top-4 right-4">
        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
      <h1 className="text-4xl font-bold mb-8">Zoomify Chatroom</h1>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Enter Your Username</h2>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="mb-4"
        />
        <h2 className="text-2xl font-semibold mb-4">Create a New Room</h2>
        <div className="flex mb-4">
          <Input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter room name"
            className="flex-grow mr-2"
          />
          <Button onClick={handleCreateRoom}>Create Room</Button>
        </div>
        {rooms.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li key={room.id} className="flex justify-between items-center bg-secondary p-3 rounded">
                  <span className="text-blue-500">{room.name}</span>
                  <div>
                    <Button onClick={() => handleJoinRoom(room.id)} className="mr-2">Join</Button>
                    <Button variant="destructive" onClick={() => handleDeleteRoom(room.id)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
