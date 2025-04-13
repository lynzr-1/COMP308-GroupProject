import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import { getToken, removeToken } from "./utils/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              me {
                username
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data?.me?.username) {
            setUsername(res.data.me.username);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        });
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUsername("");
    setPage("login");
  };

  const handleLoginSuccess = (token) => {
    setIsLoggedIn(true);
    setPage("game");
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            me {
              username
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setUsername(res.data?.me?.username || "");
      });
  };
  

  const canAccessGame = isLoggedIn;

  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-light px-3 mb-3">
        <span className="navbar-brand"><img src="/assets/MazeRushLogo.png" alt="Maze Rush Logo" className="logo-img" width="275px" /></span>             
        <div className="navbar-nav me-auto">
          {!isLoggedIn && (
            <>
              <button className="btn btn-outline-primary me-2" onClick={() => setPage("login")}>Login</button>
              <button className="btn btn-outline-primary me-2" onClick={() => setPage("register")}>Register</button>
            </>
          )}
          <button className="btn btn-outline-success me-2" onClick={() => setPage("game")}>Game</button>
          <button className="btn btn-outline-secondary" onClick={() => setPage("leaderboard")}>Leaderboard</button>
        </div>
        <div className="d-flex align-items-center">
          {isLoggedIn && (
            <>
              <span className="me-3 text-muted">Signed in as <strong>{username}</strong></span>
              <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        {page === "login" && <Login onLogin={handleLoginSuccess} />}
        {page === "register" && <Register onRegister={handleLoginSuccess} />}
        {page === "game" && (
          canAccessGame ? (
            <Game />
          ) : (
            <div className="alert alert-warning">You must be logged in to play the game.</div>
          )
        )}
        {page === "leaderboard" && <Leaderboard />}
      </div>
    </div>
  );
}
