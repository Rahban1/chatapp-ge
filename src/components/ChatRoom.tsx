import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Message {
  text: string;
  sender: string;
  isSelf: boolean;
}

interface ChatRoomProps {
  messages: Message[];
  inputVal: string;
  setInputVal: (value: string) => void;
  onSendMessage: () => void;
  roomId: string;
  username: string;
}

export function ChatRoom({ messages, inputVal, setInputVal, onSendMessage, roomId }: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-[#efeae2]">
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold">{roomId[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-semibold">Room: {roomId}</h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isSelf && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold">{message.sender[0]?.toUpperCase()}</span>
              </div>
            )}
            <div className={`px-4 py-2 rounded-lg max-w-[70%] shadow ${
              message.isSelf ? 'bg-[#dcf8c6]' : 'bg-white'
            }`}>
              {message.text}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-100 p-4 flex items-center space-x-3">
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSendMessage}
          className="bg-[#075e54] text-white rounded-full p-3 hover:bg-[#128c7e]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}