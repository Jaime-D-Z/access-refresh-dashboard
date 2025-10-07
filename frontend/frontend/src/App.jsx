import { useEffect, useState } from "react";
import { getTokens, generateNewToken } from "./api";
import TokenCard from "./components/TokenCard";
import Header from "./components/Header";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const fetchToken = async () => {
    const data = await getTokens();
    setToken(data);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateNewToken();
    setToken(data);
    setLoading(false);
  };

  // Aplicar dark mode al body
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchToken();
  }, []);

  if (!token) return <div className="loading">Cargando...</div>;

  return (
    <div className="app">
      <Header
        loading={loading}
        onGenerate={handleGenerate}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="tokens-container">
        <TokenCard label="Access Token" value={token.access_token} />
        <TokenCard label="Refresh Token" value={token.refresh_token} />
        <div className="token-card">
          <strong>Última actualización: </strong>
          {new Date(token.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
