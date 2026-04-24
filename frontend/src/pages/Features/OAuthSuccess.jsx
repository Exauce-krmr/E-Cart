import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

export default function OAuthSuccess({ navigate }) {
  const { login } = useApp();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(userParam);
        login(user, token);
        window.history.replaceState(null, '', '/');
        navigate("/");
      } catch (err) {
        console.error("Failed to parse user from query", err);
        setErrorMsg("Failed to parse user data from Google.");
      }
    } else {
        setErrorMsg("Missing token or user data from backend redirect.");
    }
  }, [login, navigate]);

  if (errorMsg) {
      return (
          <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--error)' }}>
              <h2>Login Failed</h2>
              <p>{errorMsg}</p>
              <button onClick={() => navigate('/login')} className="btn-primary" style={{ marginTop: 20 }}>Back to Login</button>
          </div>
      );
  }

  return (
    <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--charcoal)' }}>
        Loading your account... 🔄
    </div>
  );
}
