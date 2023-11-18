// app.js
const express = require('express');
const app = express();
const port = 3020;
const cors = require('cors');
const productRoutes = require('./routes/products');
const multer = require('multer');

//Requerimos el modulo cors para permitir acceso de cualquier origen

app.use(cors());

// Configurar Multer para manejar las imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');  // La carpeta donde se almacenarán las imágenes
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);  // Nombre del archivo
    },
  });
  
const upload = multer({ storage: storage });
  

app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
