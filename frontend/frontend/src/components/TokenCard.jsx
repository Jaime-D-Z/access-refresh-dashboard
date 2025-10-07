import { useState } from "react";

export default function TokenCard({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="token-card">
      <h3>{label}</h3>
      <pre>{value}</pre>
      <button onClick={handleCopy}>{copied ? "¡Copiado!" : "Copiar"}</button>
    </div>
  );
}
