import { useContext } from "react";
import Register from "./Register";
import { UserContext } from "./UserContext";

export default function Routes() {
  const {username, id}: any = useContext(UserContext);

  if (username) {
    return 'logged in!'
  }

  return (
    <Register />
  )
}