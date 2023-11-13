import { UserProvider } from "./context";
import Main from "./components/Main";

export default function App() {

  return (
    <UserProvider>
      <Main />
    </UserProvider>
  )
}