export default function Avatar({ username, userId }: { username: string, userId: string }) {
  const colorList: string[] = ["bg-red-200", "bg-orange-200", "bg-amber-200", "bg-yellow-200", "bg-lime-200", "bg-green-200", "bg-emerald-200", "bg-teal-200", "bg-cyan-200", "bg-sky-200", "bg-blue-200", "bg-violet-200", "bg-purple-200", "bg-stone-200", ];
  const avatarColorIndex: number = parseInt(userId, 16) % colorList.length;
  const avatarColor: string = colorList[avatarColorIndex];
  return (
    <div className={"w-8 h-8 rounded-full flex items-center " + avatarColor}>
      <div className="text-center w-full opacity-70">{username[0]}</div>
    </div>
  )
}