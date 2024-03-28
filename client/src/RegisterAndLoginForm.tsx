import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("Login");
  const [formChangeText, setFormChangeText] = useState("Need an account? Register here");
  const { setUsername: setLoggedInUsername, setId }: any = useContext(UserContext);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const { data }: any = await axios.post(isLoginOrRegister.toLowerCase(), { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  }

  function toggleFormType(): void {
    if (isLoginOrRegister === "Register") {
      setIsLoginOrRegister("Login");
      setFormChangeText("Need an account? Register here");
    } else {
      setIsLoginOrRegister("Register");
      setFormChangeText("Already a member? Login here");
    }
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          type="text"
          placeholder="username"
          autoComplete="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          autoComplete="current-password"
          className="block w-full rounded-sm p-2 mb-2 border" />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2 border" type="submit">
          {isLoginOrRegister}
        </button>
        <div className="text-center mt-2">
          <div>
            <button type="button" onClick={toggleFormType}>{formChangeText}</button>
          </div>
        </div>
      </form>
    </div>
  )
}