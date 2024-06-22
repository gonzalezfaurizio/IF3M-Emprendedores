const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = "./data/ventas.json";

/**
 * @typedef {Object} Venta
 * @property {number} id - El identificador único de la venta.
 * @property {string} producto - El nombre del producto vendido.
 * @property {number} cantidad - La cantidad del producto vendido.
 * @property {number} precio - El precio del producto vendido.
 */

/**
 * Lee el archivo JSON de ventas y responde con su contenido.
 * @name LeerVentas
 * @route {GET} /
 * @returns {Array<Venta>} Un array de objetos de ventas.
 */
router.get("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error al leer el archivo");
    }
    res.send(JSON.parse(data));
  });
});

/**
 * Agrega una nueva venta al archivo JSON de ventas.
 * @name AgregarVenta
 * @route {POST} /
 * @body {Venta} venta - Los detalles de la venta a agregar.
 * @returns {Venta} La venta agregada con su nuevo ID.
 */
router.post("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error al leer el archivo");
    }
    const ventas = JSON.parse(data);
    const nuevaVenta = req.body;
    nuevaVenta.id = ventas.length + 1;
    ventas.push(nuevaVenta);
    fs.writeFile(filePath, JSON.stringify(ventas), (err) => {
      if (err) {
        return res.status(500).send("Error al escribir en el archivo");
      }
      res.send(nuevaVenta);
    });
  });
});

module.exports = router;
