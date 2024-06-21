const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");
const app = express();
const port = 3000;

// Configuración de multer para manejar archivos de imagen
const upload = multer({ dest: "public/images/" });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configuración de sesiones
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware para verificar autenticación
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

// Ruta para el inicio de sesión
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

// Rutas protegidas
app.use("/productos", isAuthenticated, require("./routes/productos"));
app.use("/compras", isAuthenticated, require("./routes/compras"));
app.use("/ventas", isAuthenticated, require("./routes/ventas"));

// Inicio del servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
