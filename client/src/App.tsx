import axios from "axios"
import Register from "./Register"
import { UserContextProvider } from "./UserContext";

function App() {
  axios.defaults.baseURL = 'http://localhost:4040';
  axios.defaults.withCredentials = true;
  return (
    <>
      <UserContextProvider>
        <Register />
      </UserContextProvider>
    </>
  )
}

export default App