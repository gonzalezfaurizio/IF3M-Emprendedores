const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = "./data/ventas.json";

// Leer ventas
router.get("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }
    res.send(JSON.parse(data));
  });
});

// Agregar venta
router.post("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }
    const ventas = JSON.parse(data);
    const newVenta = req.body;
    newVenta.id = ventas.length + 1;
    ventas.push(newVenta);
    fs.writeFile(filePath, JSON.stringify(ventas), (err) => {
      if (err) {
        return res.status(500).send("Error writing file");
      }
      res.send(newVenta);
    });
  });
});

module.exports = router;
