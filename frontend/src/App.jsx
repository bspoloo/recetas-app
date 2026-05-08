import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function RecetaCard({ receta }) {
  return (
    <div className="receta-card">
      <span className="categoria">{receta.categoria}</span>
      <h2>{receta.nombre}</h2>
      <p className="tiempo">⏱ {receta.tiempo} min</p>
      <ul>
        {receta.ingredientes.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [recetas, setRecetas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/recetas`)
      .then((r) => r.json())
      .then((data) => {
        setRecetas(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo conectar con el servidor");
        setLoading(false);
      });
  }, []);

  const recetasFiltradas =
    filtro === "todas"
      ? recetas
      : recetas.filter((r) => r.categoria === filtro);

  return (
    <div className="container">
      <header>
        <h1>🍲 Recetas Bolivianas</h1>
        <p>Práctica CI/CD — GitHub Actions</p>
      </header>

      <div className="filtros">
        {["todas", "almuerzo", "desayuno"].map((cat) => (
          <button
            key={cat}
            className={filtro === cat ? "active" : ""}
            onClick={() => setFiltro(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="estado">Cargando recetas...</p>}
      {error && <p className="estado error">{error}</p>}

      <div className="grid">
        {recetasFiltradas.map((r) => (
          <RecetaCard key={r.id} receta={r} />
        ))}
      </div>
    </div>
  );
}
