const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = "./data/compras.json";

/**
 * @typedef {Object} Compra
 * @property {number} id - El identificador único de la compra.
 * @property {string} producto - El nombre del producto comprado.
 * @property {number} cantidad - La cantidad del producto comprado.
 * @property {number} precio - El precio del producto comprado.
 */

/**
 * Lee el archivo JSON de compras y responde con su contenido.
 * @name LeerCompras
 * @route {GET} /
 * @returns {Array<Compra>} Un array de objetos de compras.
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
 * Agrega una nueva compra al archivo JSON de compras.
 * @name AgregarCompra
 * @route {POST} /
 * @body {Compra} compra - Los detalles de la compra a agregar.
 * @returns {Compra} La compra agregada con su nuevo ID.
 */
router.post("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error al leer el archivo");
    }
    const compras = JSON.parse(data);
    const nuevaCompra = req.body;
    nuevaCompra.id = compras.length + 1;
    compras.push(nuevaCompra);
    fs.writeFile(filePath, JSON.stringify(compras), (err) => {
      if (err) {
        return res.status(500).send("Error al escribir en el archivo");
      }
      res.send(nuevaCompra);
    });
  });
});

module.exports = router;
