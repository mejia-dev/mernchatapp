import { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function Chat() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [activeUsers, setActiveUsers] = useState<{ [key: string]: string }>({});
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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
      activeUserObj[userId] = username;
    })
    setActiveUsers(activeUserObj);
  }

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 pl-4 pt-4">
        <div className="text-blue-600 font-bold flex gap-1 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
          </svg>

          MernChat
        </div>
        {Object.keys(activeUsers).map((userId, key) => (
          <div 
            onClick={() => setSelectedChat(userId)}
            className={"border-b border-gray-100 py-2 flex items-center gap-2 cursor-pointer " + (userId === selectedChat ? 'bg-blue-100': '')}
            key={key}
          >
            <Avatar
              username={activeUsers[userId]}
              userId={userId}
            />
            <span className="text-gray-800">{activeUsers[userId]}</span>
          </div>
        ))}
      </div>
      <div className=" flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          messages with contact
        </div>
        <div className="flex gap-1">
          <input
            type="text"
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