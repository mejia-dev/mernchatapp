import { useEffect, useState } from "react";

export default function Chat() {
  const [ws, setWs]  = useState<WebSocket | null>(null);
  const [activeUsers, setActiveUsers] = useState<{[key: string]: string}>({});


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
    userListObj.forEach(({userId, username}: UserSession) => {
      activeUserObj[userId] = username;
    })
    setActiveUsers(activeUserObj);
  }

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        {Object.keys(activeUsers).map(userId => (
          <div>{activeUsers[userId]}</div>
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