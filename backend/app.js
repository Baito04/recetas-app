// backend/app.js
const express = require('express');
const cors = require('cors');
const recetasRoutes = require('./routes/recetas');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/registros', recetasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
