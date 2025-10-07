export default function Header({ loading, onGenerate, darkMode, toggleDarkMode }) {
  return (
    <div className="header">
      <h1>Dashboard de Tokens</h1>
      <div>
        <button onClick={onGenerate} disabled={loading}>
          {loading ? "Generando..." : "Sacar nuevo token"}
        </button>
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}
