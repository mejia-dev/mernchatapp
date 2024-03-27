import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";

export default function Chat() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [activeUsers, setActiveUsers] = useState<{ [key: string]: string }>({});
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const {id}: {[id: string]: string} = useContext(UserContext);
  useEffect(() => {
    const newWs: WebSocket = new WebSocket('ws://localhost:4040');
    setWs(newWs);
    newWs.addEventListener('message', handleMessage)
  }, []);

  function handleMessage(e: any): void {
    const messageData: object = JSON.parse(e.data);
    if ('online' in messageData) {
      getActiveUsers(messageData.online);

    }
  }

  type UserSession = {
    userId: string;
    username: string;
  }

  function getActiveUsers(userListObj: any): void {
    const activeUserObj: { [userId: string]: string } = {};
    userListObj.forEach(({ userId, username }: UserSession) => {
      if (userId != id) {
        activeUserObj[userId] = username;
      }
      
    })
    setActiveUsers(activeUserObj);
  }

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />
        
        {Object.keys(activeUsers).map((userId, key) => (
          <div
            onClick={() => setSelectedChat(userId)}
            className={"border-b border-gray-100  flex items-center gap-2 cursor-pointer " + (userId === selectedChat ? 'bg-blue-100' : '')}
            key={key}
          >
            {userId === selectedChat && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-lg"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar
                username={activeUsers[userId]}
                userId={userId}
              />
              <span className="text-gray-800">{activeUsers[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className=" flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedChat && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-400">&larr; Select a chat</div>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <input
            type="text"
            id="send-message-box"
            placeholder="Message"
            className="bg-white flex-grow border rounded-lg p-2"
          />
          <button className="bg-blue-500 p-2 text-white rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}