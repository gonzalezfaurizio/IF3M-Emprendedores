/**
 * @fileoverview Aplicación principal para manejar rutas y middleware en un servidor Express.
 */

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");

/**
 * Aplicación Express.
 * @constant {Object}
 */
const app = express();

/**
 * Puerto en el que el servidor escucha las conexiones.
 * @constant {number}
 */
const port = 3000;

/**
 * Middleware para manejar la carga de archivos.
 * @constant {Object}
 */
const upload = multer({ dest: "public/images/" });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

/**
 * Middleware para verificar si el usuario está autenticado.
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

/**
 * Ruta para manejar el inicio de sesión de los usuarios.
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  fs.readFile("./data/usuarios.json", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const usuarios = JSON.parse(data);
    const user = usuarios.find((u) => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

/**
 * Ruta protegida para productos.
 */
app.use("/productos", isAuthenticated, require("./routes/productos"));

/**
 * Ruta protegida para compras.
 */
app.use("/compras", isAuthenticated, require("./routes/compras"));

/**
 * Ruta protegida para ventas.
 */
app.use("/ventas", isAuthenticated, require("./routes/ventas"));

/**
 * Inicia el servidor en el puerto especificado.
 */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
