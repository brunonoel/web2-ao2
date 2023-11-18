const express = require('express');
const app = express();
const port = 3020;
const cors = require('cors');
const productRoutes = require('./routes/products');
const multer = require('multer');

app.use(cors());
app.use(express.json()); // Agrega esto para procesar el cuerpo de la solicitud como JSON

// Configurar Multer para manejar las imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // La carpeta donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
  },
});

const upload = multer({ storage: storage });

// Usa multer en la ruta adecuada para manejar la carga de imágenes
app.post('/products', upload.array('images'), (req, res) => {
  // Lógica para manejar la carga de imágenes
  // Puedes acceder a las imágenes subidas con req.files
  // Ejemplo: const images = req.files;
  res.send('Productos creados con éxito');
});

app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
