import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // In a real app, you'd fetch rooms from your backend
    setRooms([{ id: 'main-room', name: 'Main Room' }]);
  }, []);

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      const newRoom = { id: `room-${Date.now()}`, name: newRoomName.trim() };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
    }
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      <Button onClick={toggleTheme} className="absolute top-4 right-4">
        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
      <h1 className="text-4xl font-bold mb-8">Zoomify Chatroom</h1>
      <div className="w-full max-w-md">
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
        <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li key={room.id} className="flex justify-between items-center bg-secondary p-3 rounded">
              <Link to={`/room/${room.id}`} className="text-blue-500 hover:underline">{room.name}</Link>
              <Button variant="destructive" onClick={() => handleDeleteRoom(room.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;
