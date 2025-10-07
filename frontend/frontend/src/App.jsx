import { useEffect, useState } from "react";
import { getTokens, generateNewToken } from "./api";
import TokenCard from "./components/TokenCard";
import Header from "./components/Header";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const TOKEN_DURATION = 24 * 60 * 60; // 24 horas en segundos

  const fetchToken = async () => {
    const data = await getTokens();
    setToken(data);
    if (data.updated_at) updateTimeLeft(data.updated_at);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateNewToken();
    setToken(data);
    if (data.updated_at) updateTimeLeft(data.updated_at);
    setLoading(false);
  };

  // Calcula tiempo restante desde updated_at
  const updateTimeLeft = (updatedAtStr) => {
    const updatedAt = new Date(updatedAtStr);
    const expiresAt = updatedAt.getTime() + TOKEN_DURATION * 1000;
    const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    setTimeLeft(remaining);
  };

  // Contador dinámico
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dark mode al body
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchToken();
  }, []);

  if (!token) return <div className="loading">Cargando...</div>;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const progress = TOKEN_DURATION ? (timeLeft / TOKEN_DURATION) * 100 : 0;

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Header
        loading={loading}
        onGenerate={handleGenerate}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="tokens-container">
        <TokenCard label="Access Token" value={token.access_token} />
        <TokenCard label="Refresh Token" value={token.refresh_token} />

        <div className="token-card countdown-card">
          <h3>Tiempo restante del Access Token</h3>
          <p className="countdown">{formatTime(timeLeft)}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="token-card">
          <strong>Última actualización: </strong>
          {new Date(token.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

