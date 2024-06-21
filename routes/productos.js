const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/images/" });

const filePath = "./data/productos.json";

// Leer productos
router.get("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }
    res.send(JSON.parse(data));
  });
});

// Agregar producto
router.post("/", upload.single("imagen"), (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }
    const productos = JSON.parse(data);
    const newProduct = req.body;
    newProduct.codigo = productos.length + 1;
    if (req.file) {
      newProduct.imagen = `/images/${req.file.filename}`;
    }
    productos.push(newProduct);
    fs.writeFile(filePath, JSON.stringify(productos), (err) => {
      if (err) {
        return res.status(500).send("Error writing file");
      }
      res.send(newProduct);
    });
  });
});

// Actualizar producto
router.put("/:codigo", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }
    const productos = JSON.parse(data);
    const codigo = parseInt(req.params.codigo);
    const productIndex = productos.findIndex((p) => p.codigo === codigo);
    if (productIndex === -1) {
      return res.status(404).send("Product not found");
    }
    const updatedProduct = req.body;
    productos[productIndex] = { ...productos[productIndex], ...updatedProduct };
    fs.writeFile(filePath, JSON.stringify(productos), (err) => {
      if (err) {
        return res.status(500).send("Error writing file");
      }
      res.send(productos[productIndex]);
    });
  });
});

// Eliminar producto
router.delete("/:codigo", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }
    const productos = JSON.parse(data);
    const codigo = parseInt(req.params.codigo);
    const productIndex = productos.findIndex((p) => p.codigo === codigo);
    if (productIndex === -1) {
      return res.status(404).send("Product not found");
    }
    productos.splice(productIndex, 1);
    fs.writeFile(filePath, JSON.stringify(productos), (err) => {
      if (err) {
        return res.status(500).send("Error writing file");
      }
      res.send("Product deleted");
    });
  });
});

module.exports = router;
