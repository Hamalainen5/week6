// frontend/src/App.jsx
import { useState, useEffect } from "react";
import LoginComponent from "./pages/LoginComponent";
import SignupComponent from "./pages/SignupComponent";
import { getUser, removeUser } from "./utils/storage";

function App() {
  const [user, setUser] = useState(null);

  // Load user from sessionStorage when app starts
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    removeUser();
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        // Show Login if not authenticated
        <LoginComponent setUser={setUser} />
      ) : (
        // Show dashboard if authenticated
        <div>
          <h2>Welcome {user.email}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
