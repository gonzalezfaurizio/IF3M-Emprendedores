const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/images/" });

const filePath = "./data/productos.json";

/**
 * @typedef {Object} Producto
 * @property {number} codigo - El código único del producto.
 * @property {string} nombre - El nombre del producto.
 * @property {number} precio - El precio del producto.
 * @property {string} [imagen] - La ruta de la imagen del producto.
 */

/**
 * Lee el archivo JSON de productos y responde con su contenido.
 * @name LeerProductos
 * @route {GET} /
 * @returns {Array<Producto>} Un array de objetos de productos.
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
 * Agrega un nuevo producto al archivo JSON de productos.
 * @name AgregarProducto
 * @route {POST} /
 * @param {Express.Request} req - La solicitud HTTP.
 * @param {Express.Response} res - La respuesta HTTP.
 * @returns {Producto} El producto agregado con su nuevo código.
 */
router.post("/", upload.single("imagen"), (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error al leer el archivo");
    }
    const productos = JSON.parse(data);
    const nuevoProducto = req.body;
    nuevoProducto.codigo = productos.length + 1;
    if (req.file) {
      nuevoProducto.imagen = `/images/${req.file.filename}`;
    }
    productos.push(nuevoProducto);
    fs.writeFile(filePath, JSON.stringify(productos), (err) => {
      if (err) {
        return res.status(500).send("Error al escribir en el archivo");
      }
      res.send(nuevoProducto);
    });
  });
});

/**
 * Actualiza un producto existente en el archivo JSON de productos.
 * @name ActualizarProducto
 * @route {PUT} /:codigo
 * @param {Express.Request} req - La solicitud HTTP.
 * @param {Express.Response} res - La respuesta HTTP.
 * @returns {Producto} El producto actualizado.
 */
router.put("/:codigo", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error al leer el archivo");
    }
    const productos = JSON.parse(data);
    const codigo = parseInt(req.params.codigo);
    const indiceProducto = productos.findIndex((p) => p.codigo === codigo);
    if (indiceProducto === -1) {
      return res.status(404).send("Producto no encontrado");
    }
    const productoActualizado = req.body;
    productos[indiceProducto] = {
      ...productos[indiceProducto],
      ...productoActualizado,
    };
    fs.writeFile(filePath, JSON.stringify(productos), (err) => {
      if (err) {
        return res.status(500).send("Error al escribir en el archivo");
      }
      res.send(productos[indiceProducto]);
    });
  });
});

/**
 * Elimina un producto del archivo JSON de productos.
 * @name EliminarProducto
 * @route {DELETE} /:codigo
 * @param {Express.Request} req - La solicitud HTTP.
 * @param {Express.Response} res - La respuesta HTTP.
 * @returns {string} Mensaje de confirmación de eliminación.
 */
router.delete("/:codigo", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("Error al leer el archivo");
    }
    const productos = JSON.parse(data);
    const codigo = parseInt(req.params.codigo);
    const indiceProducto = productos.findIndex((p) => p.codigo === codigo);
    if (indiceProducto === -1) {
      return res.status(404).send("Producto no encontrado");
    }
    productos.splice(indiceProducto, 1);
    fs.writeFile(filePath, JSON.stringify(productos), (err) => {
      if (err) {
        return res.status(500).send("Error al escribir en el archivo");
      }
      res.send("Producto eliminado");
    });
  });
});

module.exports = router;
