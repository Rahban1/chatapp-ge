import { useState } from 'react';
import { motion } from 'framer-motion';

interface RoomSelectionProps {
  onRoomSelect: (roomId: string, username: string) => void;
}

export function RoomSelection({ onRoomSelect }: RoomSelectionProps) {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const handleJoinRoom = () => {
    if (roomId.trim() && username.trim()) {
      onRoomSelect(roomId, username);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-screen w-full flex justify-center items-center bg-gray-100"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Join a Chat Room</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleJoinRoom}
          disabled={!roomId.trim() || !username.trim()}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300"
        >
          Join Room
        </button>
      </motion.div>
    </motion.div>
  );
}