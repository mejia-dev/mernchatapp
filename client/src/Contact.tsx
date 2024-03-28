import Avatar from "./Avatar.jsx";

export default function Contact(
  { id, username, onClickFn, isSelected, isOnline } : 
  { id: string, username: string, onClickFn: any, isSelected: boolean, isOnline: boolean }
  ) {
  return (
    <div key={id} onClick={() => onClickFn(id)}
      className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer " + (isSelected ? 'bg-blue-50' : '')}>
      {isSelected && (
        <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
      )}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={isOnline} username={username} userId={id} />
        <span className="text-gray-800">{username}</span>
      </div>
    </div>
  );
}