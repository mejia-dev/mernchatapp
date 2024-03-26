import { createContext, useState } from "react";

export const UserContext: React.Context<{}> = createContext({});

export function UserContextProvider({children}: any) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  return (
    <UserContext.Provider value={{username, setUsername, id, setId}}>{children}</UserContext.Provider>
  )
}