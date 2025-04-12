import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  const [page, setPage] = useState("login");

  return (
    <div>
      <nav>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>
        <button onClick={() => setPage("game")}>Game</button>
        <button onClick={() => setPage("leaderboard")}>Leaderboard</button>
      </nav>

      {page === "login" && <Login />}
      {page === "register" && <Register />}
      {page === "game" && <Game />}
      {page === "leaderboard" && <Leaderboard />}

    </div>
  );
}
