// backend/routes/recetas.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../data/recetas.json');

// Obtener todas las recetas
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    const recetas = JSON.parse(data);
    res.json(recetas);
  } catch (error) {
    console.error('Error al leer recetas:', error);
    res.status(500).json({ error: 'Error al leer las recetas' });
  }
});

// Crear una nueva receta
router.post('/', (req, res) => {
  try {
    const { nombre, ingredientes, preparacion, categoria } = req.body;

    if (!nombre || !ingredientes || !preparacion || !categoria) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const nuevaReceta = {
      id: Date.now().toString(), // ID único simple como string
      nombre,
      ingredientes,
      preparacion,
      categoria,
      fecha: new Date().toISOString()
    };

    let recetas = [];

    if (fs.existsSync(DATA_PATH)) {
      const data = fs.readFileSync(DATA_PATH, 'utf-8');
      recetas = JSON.parse(data);
    }

    recetas.push(nuevaReceta);
    fs.writeFileSync(DATA_PATH, JSON.stringify(recetas, null, 2));

    res.status(201).json({ mensaje: 'Receta guardada', receta: nuevaReceta });
  } catch (error) {
    console.error('Error al guardar la receta:', error);
    res.status(500).json({ error: 'Error al guardar la receta' });
  }
});

// Actualizar una receta existente
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ingredientes, preparacion, categoria } = req.body;

    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    const recetas = JSON.parse(data);

    const index = recetas.findIndex((receta) => receta.id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    recetas[index] = {
      ...recetas[index],
      nombre,
      ingredientes,
      preparacion,
      categoria,
      fecha: new Date().toISOString()
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(recetas, null, 2));
    res.json({ mensaje: 'Receta actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la receta:', error);
    res.status(500).json({ error: 'Error al actualizar la receta' });
  }
});

// Eliminar una receta
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    const recetas = JSON.parse(data);

    const nuevasRecetas = recetas.filter((receta) => receta.id.toString() !== id);

    if (recetas.length === nuevasRecetas.length) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(nuevasRecetas, null, 2));
    res.json({ mensaje: 'Receta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la receta:', error);
    res.status(500).json({ error: 'Error al eliminar la receta' });
  }
});

module.exports = router;
