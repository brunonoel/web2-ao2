/*
//** routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mysql=require('mysql2');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// routes/products.js
// ... (otros imports)

// Endpoint para cargar imágenes de productos
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const imageUrl = req.file.path;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Otros endpoints CRUD (crear, actualizar, borrar) aquí...

// Crear una conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost', // Cambia esto si tu base de datos está en otro servidor
  user: 'root',
  password: 'root',
  database: 'bd_productos',
  connectTimeout: 60000,
});
// Conectar a la base de datos
db.connect((err) => {
  if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});

// ruta de contactos 
// previo a la api, procesamos el midlleware para que devuelva json / texto
router.use(express.json());
router.use(express.text());

// vamos a construir una API REST DE CONTACTOS QUE IMPLEMENTARÁ CRUD
// devuelve todos los contactos
class Contacto {
  constructor(ap, nom, em) {
      this.apellido = ap;
      this.nombres = nom;
      this.email = em;
  }
}
router.get('/',(req,res)=>{
  const sql = 'SELECT * FROM contactos';    
  db.query(sql, (err, rows) => {
      if (err) {
          console.error('Error al consultar la base de datos:', err);            
          res.send('Error interno del servidor.');
      } else { 
          console.log(rows); 
          res.json(rows)             
      }        
  });     
})

router.get('/:id',(req,res)=>{
  let idContacto=req.params.id;
  console.log(idContacto);
  const sql = 'SELECT * FROM contactos where idContacto=?';  
  
  // funcion para saber si el array está vacío
  const arrayVacio = (arr) => !Array.isArray(arr) || arr.length === 0;


  db.query(sql,idContacto, (err, rows) => {
      if (err) {
          console.error('Error al consultar la base de datos:', err);            
          res.send('Error interno del servidor.');
      } else { 
          if(arrayVacio(rows)){
                     
              console.log(rows);
              res.json([{mensaje:'No existe el contacto solicitado'}])  
          }else{
              res.json(rows) 
              console.log(rows);   
          }
             
      }        
  }); 
})
// hay que parsear la info que manda el formulario, se usa el modulo bodyparser
//const bodyParser=require('body-parser')
// pasamos el bodyparser al middleware, con extended=false para que solo procese texto
//contactosRouter.use(bodyParser.urlencoded({ extended: false }));

router.post('/nuevo',(req,res)=>{      

  let apellido=req.body.apellido;
  let nombres=req.body.nombres;
  let email=req.body.email;   
 
  const sql = 'INSERT INTO contactos (apellido, nombres, email) VALUES (?, ?, ?)';
  const values = [apellido, nombres, email]; 
  const nuevoContacto= new Contacto(apellido,nombres,email);

  db.query(sql,values, (err, rows) => {
      if (err) {
          console.error('Error al agregar en la base de datos:', err);            
          res.send('Los Datos no se pudieron agregar en la base de datos');
      } else {              
          res.send('El contacto :' + JSON.stringify(nuevoContacto) + ' se agregó correctamente');            
      }        
  }); 
  
})
router.put('/modificar',(req,res)=>{
  let idContacto=req.body.idContacto;
  let apellido=req.body.apellido;
  let nombres=req.body.nombres;
  let email=req.body.email;
  const sql = 'UPDATE contactos SET apellido=?,nombres=?,email=? where idContacto= ? ';
  const values = [apellido, nombres, email,idContacto]; 
  const contactoActualizado= new Contacto(apellido,nombres,email); 
  db.query(sql,values, (err, rows) => {
      if (err) {
          console.error('Error al modificar en la base de datos:', err);            
          res.send('Los Datos no se pudieron modificar en la base de datos');
      } else {              
          res.send('Se modificaron los datos del contacto con los siguientes datos ' + JSON.stringify(contactoActualizado));            
      }        
  }); 
})

router.delete('/:id',(req,res)=>{
  let idContacto=req.params.id;
  const sql = 'DELETE FROM contactos where idContacto='+idContacto;    
  db.query(sql, (err, rows) => {
      if (err) {
          console.error('Error al consultar la base de datos:', err);            
          res.send('Error interno del servidor.');
      } else {              
          res.send('Se eliminó el contacto cuyo id es ' + idContacto);            
      }        
  }); 
})

module.exports = router; */

const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const db = require('./db'); // Importa la conexión a la base de datos
const multer = require('multer');

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

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para obtener un producto por su ID
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, precio, marca, stock } = req.body;
        const newProduct = await Product.create({
            nombre,
            descripcion,
            precio,
            marca,
            stock,
        });

        res.json({ message: 'Producto creado con éxito', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para actualizar un producto por su ID
router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { nombre, descripcion, precio, marca, stock } = req.body;

        const product = await Product.findByPk(productId);

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        // Actualiza las propiedades del producto
        product.nombre = nombre;
        product.descripcion = descripcion;
        product.precio = precio;
        product.marca = marca;
        product.stock = stock;

        await product.save();

        res.json({ message: 'Producto actualizado con éxito', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para borrar un producto por su ID
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        await product.destroy();

        res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para cargar imágenes de productos
router.post('/upload', upload.single('imagen'), async (req, res) => {
    try {
        // Lógica para manejar la carga de imágenes
        // Accede a la imagen subida con req.file
        // Ejemplo: const imagen = req.file;

        res.json({ message: 'Imagen subida con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
