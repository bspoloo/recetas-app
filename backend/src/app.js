const express = require("express");
const cors = require("cors");
const { recetas } = require("./recetas");

const app = express();
app.use(cors());
app.use(express.json());

// GET todas las recetas
app.get("/api/recetas", (req, res) => {
  res.json(recetas);
});

// GET receta por id
app.get("/api/recetas/:id", (req, res) => {
  const receta = recetas.find((r) => r.id === parseInt(req.params.id));
  if (!receta) return res.status(404).json({ error: "Receta no encontrada" });
  res.json(receta);
});

// GET recetas por categoría
app.get("/api/recetas/categoria/:cat", (req, res) => {
  const resultado = recetas.filter((r) => r.categoria === req.params.cat);
  res.json(resultado);
});

module.exports = app;
