import { useRef, useState, useEffect } from "react"
import { RoomSelection } from "./components/RoomSelection"
import { ChatRoom } from "./components/ChatRoom"

interface Message {
  text: string;
  sender: string;
  isSelf: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsref = useRef<WebSocket>();

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (wsref.current) {
        wsref.current.close();
      }
    };
  }, []);

  const handleRoomSelect = (selectedRoom: string, userName: string) => {
    // Close existing WebSocket connection if it exists
    if (wsref.current) {
      wsref.current.close();
      wsref.current = undefined;
    }

    setRoomId(selectedRoom);
    setUsername(userName);
    
    try {
      const ws = new WebSocket("wss://13.61.97.168/:8080");
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "chat") {
            setMessages(m => [...m, {
              text: data.payload.message,
              sender: data.payload.sender,
              isSelf: data.payload.sender === userName
            }]);
          }
        } catch (e) {
          setMessages(m => [...m, {
            text: event.data,
            sender: 'System',
            isSelf: false
          }]);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setMessages(m => [...m, {
          text: 'Connection error occurred. Please try reconnecting.',
          sender: 'System',
          isSelf: false
        }]);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setMessages(m => [...m, {
          text: 'Connection closed. Please refresh to reconnect.',
          sender: 'System',
          isSelf: false
        }]);
      };

      ws.onopen = () => {
        setIsConnected(true);
        ws.send(JSON.stringify({
          type: "join",
          payload: {
            roomId: selectedRoom,
            username: userName
          }
        }));
      };

      wsref.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setMessages(m => [...m, {
        text: 'Failed to establish connection. Please try again.',
        sender: 'System',
        isSelf: false
      }]);
    }
  };

  const handleSendMessage = () => {
    if (inputVal.trim() && wsref.current && username && isConnected) {
      try {
        const message = {
          type: "chat",
          payload: {
            message: inputVal,
            sender: username,
            roomId: roomId
          }
        };
        wsref.current.send(JSON.stringify(message));
        setInputVal("");
      } catch (error) {
        console.error('Failed to send message:', error);
        setMessages(m => [...m, {
          text: 'Failed to send message. Please try again.',
          sender: 'System',
          isSelf: false
        }]);
      }
    }
  };

  if (!roomId || !username) {
    return <RoomSelection onRoomSelect={handleRoomSelect} />;
  }

  return (
    <ChatRoom
      messages={messages}
      inputVal={inputVal}
      setInputVal={setInputVal}
      onSendMessage={handleSendMessage}
      roomId={roomId}
      username={username}
    />
  );
}

export default App;
