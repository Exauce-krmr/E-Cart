import { useEffect } from "react";
import { useApp } from "../../context/AppContext";

export default function OAuthSuccess({ navigate }) {
  const { login } = useApp();

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
        window.history.replaceState(null, '', '/');
        navigate("/login");
      }
    } else {
        navigate("/login");
    }
  }, [login, navigate]);

  return (
    <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--charcoal)' }}>
        Loading your account... 🔄
    </div>
  );
}
