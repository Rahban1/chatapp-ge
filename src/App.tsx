import { useRef, useState } from "react"
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
  const wsref = useRef<WebSocket>();

  const handleRoomSelect = (selectedRoom: string, userName: string) => {
    setRoomId(selectedRoom);
    setUsername(userName);
    const ws = new WebSocket("http://13.61.21.10:8080");
    
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
        // Handle plain text messages
        setMessages(m => [...m, {
          text: event.data,
          sender: 'System',
          isSelf: false
        }]);
      }
    };

    wsref.current = ws;
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: selectedRoom,
          username: userName
        }
      }));
    };
  };

  const handleSendMessage = () => {
    if (inputVal.trim() && wsref.current && username) {
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
