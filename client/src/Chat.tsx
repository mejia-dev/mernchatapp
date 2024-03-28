import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function Chat() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [activeUsers, setActiveUsers] = useState<{ [key: string]: string }>({});
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const { id } = useContext<{ [id: string]: string }>(UserContext);
  const [newMessageText, setNewMessageText] = useState<string>("");
  const [messageList, setMessageList] = useState<object[]>([]);

  useEffect(() => {
    connectToWebSocket();
  }, [selectedRecipientId]);

  function connectToWebSocket(): void {
    const newWs: WebSocket = new WebSocket("ws://localhost:4040");
    setWs(newWs);
    newWs.addEventListener("message", handleMessage)
    newWs.addEventListener("close", () => {
      setTimeout(() => {
        connectToWebSocket();
      }, 1000)
    })
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

  function handleMessage(e: any): void {
    const messageData: any = JSON.parse(e.data);
    console.log({ e, messageData });
    if ("online" in messageData) {
      getActiveUsers(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedRecipientId)
        setMessageList(prev => ([...prev, { ...messageData }]));
    }
  }

  function sendMessage(e: any): void {
    e.preventDefault();
    ws?.send(JSON.stringify({
      recipientId: selectedRecipientId,
      messageText: newMessageText
    }));
    setNewMessageText("");
    setMessageList(prev => [...prev, {
      text: newMessageText,
      sender: id,
      recipient: selectedRecipientId,
      _id: Date.now()
    }]);
  }

  useEffect(() => {
    document.getElementById("messageChatScroller")?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messageList])

  useEffect(() => {
    if (selectedRecipientId) {
      axios.get("/messages/" + selectedRecipientId).then(res => {
        setMessageList(res.data);
      });
    }
  }, [selectedRecipientId]);

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />

        {Object.keys(activeUsers).map((userId) => (
          <div
            onClick={() => setSelectedRecipientId(userId)}
            className={"border-b border-gray-100  flex items-center gap-2 cursor-pointer " + (userId === selectedRecipientId ? "bg-blue-100" : "")}
            key={userId}
          >
            {userId === selectedRecipientId && (
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
          {!selectedRecipientId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-400">&larr; Select a chat</div>
            </div>
          )}
          {!!selectedRecipientId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messageList.map((message: any) => (
                  <div key={message._id} className={(message.sender === id ? "text-right" : "text-left")}>
                    <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " + (message.sender === id ? "bg-blue-500 text-white" : "bg-white text-gray-500")}>
                      {message.text}
                    </div>
                  </div>
                ))}
                <div id="messageChatScroller"></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedRecipientId && (
          <form className="flex gap-1" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              id="send-message-box"
              placeholder="Message"
              className="bg-white flex-grow border rounded-lg p-2"
            />
            <button type="submit" className="bg-blue-500 p-2 text-white rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}