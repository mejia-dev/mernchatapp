export default function Avatar({ username, userId }: { username: string, userId: string }) {
  const colorList: string[] = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "violet", "purple", "stone", ];
  const avatarColorIndex: number = parseInt(userId, 16) % colorList.length;
  const avatarColor: string = colorList[avatarColorIndex];
  return (
    <div className={"w-8 h-8 bg-" + avatarColor + "-200 rounded-full flex items-center"}>
      <div className="text-center w-full opacity-70">{username[0]}</div>
    </div>
  )
}