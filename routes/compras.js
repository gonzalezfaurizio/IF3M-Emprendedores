const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = "./data/compras.json";

// Leer compras
router.get("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }
    res.send(JSON.parse(data));
  });
});

// Agregar compra
router.post("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }
    const compras = JSON.parse(data);
    const newCompra = req.body;
    newCompra.id = compras.length + 1;
    compras.push(newCompra);
    fs.writeFile(filePath, JSON.stringify(compras), (err) => {
      if (err) {
        return res.status(500).send("Error writing file");
      }
      res.send(newCompra);
    });
  });
});

module.exports = router;
