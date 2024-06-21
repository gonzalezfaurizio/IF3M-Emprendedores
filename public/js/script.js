document.addEventListener("DOMContentLoaded", () => {
  // Manejo de productos
  fetch("/productos")
    .then((response) => response.json())
    .then((data) => {
      const productList = document.getElementById("product-list");
      if (productList) {
        data.forEach((product) => {
          const productItem = document.createElement("div");
          productItem.className = "product-item";
          productItem.innerHTML = `
            <h3>${product.nombre}</h3>
            <p>Empresa: ${product.nombreEmpresa}</p>
            <img src="${product.imagen || "default-image.png"}" alt="${
            product.nombre
          }" width="100">
            <button onclick="viewProduct(${
              product.codigo
            })">Ver Detalle</button>
          `;
          productList.appendChild(productItem);
        });
      }
    });

  const productoForm = document.getElementById("producto-form");
  if (productoForm) {
    productoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(productoForm);
      fetch("/productos", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then(() => {
          alert("Producto registrado");
          window.location.reload();
        })
        .catch((err) => alert("Error: " + err.message));
    });
  }

  // Manejo de compras
  const compraForm = document.getElementById("compra-form");
  if (compraForm) {
    compraForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(compraForm);
      const data = {
        idProducto: parseInt(formData.get("idProducto")),
        unidades: parseInt(formData.get("unidades")),
        fecha: new Date().toISOString(),
      };
      fetch("/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(() => {
          alert("Compra registrada");
          window.location.reload();
        })
        .catch((err) => alert("Error: " + err.message));
    });

    fetch("/compras")
      .then((response) => response.json())
      .then((data) => {
        const compraList = document.getElementById("compra-list");
        if (compraList) {
          data.forEach((compra) => {
            const compraItem = document.createElement("div");
            compraItem.className = "compra-item";
            compraItem.innerHTML = `
              <p>ID Compra: ${compra.id}</p>
              <p>ID Producto: ${compra.idProducto}</p>
              <p>Unidades: ${compra.unidades}</p>
              <p>Fecha: ${compra.fecha}</p>
            `;
            compraList.appendChild(compraItem);
          });
        }
      });
  }

  // Manejo de ventas
  const ventaForm = document.getElementById("venta-form");
  if (ventaForm) {
    ventaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(ventaForm);
      const data = {
        idProducto: parseInt(formData.get("idProducto")),
        unidades: parseInt(formData.get("unidades")),
        fecha: new Date().toISOString(),
      };
      fetch("/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(() => {
          alert("Venta registrada");
          window.location.reload();
        })
        .catch((err) => alert("Error: " + err.message));
    });

    fetch("/ventas")
      .then((response) => response.json())
      .then((data) => {
        const ventaList = document.getElementById("venta-list");
        if (ventaList) {
          data.forEach((venta) => {
            const ventaItem = document.createElement("div");
            ventaItem.className = "venta-item";
            ventaItem.innerHTML = `
              <p>ID Venta: ${venta.id}</p>
              <p>ID Producto: ${venta.idProducto}</p>
              <p>Unidades: ${venta.unidades}</p>
              <p>Fecha: ${venta.fecha}</p>
            `;
            ventaList.appendChild(ventaItem);
          });
        }
      });
  }

  // Manejo de inicio de sesión
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const data = {
        username: formData.get("username"),
        password: formData.get("password"),
      };
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.ok) {
          window.location.href = "index.html";
        } else {
          alert("Invalid credentials");
        }
      });
    });
  }
});

function viewProduct(codigo) {
  window.location.href = `productos.html?codigo=${codigo}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");

  if (codigo) {
    fetch(`/productos/${codigo}`)
      .then((response) => response.json())
      .then((product) => {
        const productDetail = document.getElementById("product-detail");
        if (productDetail) {
          productDetail.innerHTML = `
            <h2>${product.nombre}</h2>
            <p>Código: ${product.codigo}</p>
            <p>Precio: ${product.precioVenta}</p>
            <p>Stock: ${product.stock}</p>
            <p>Empresa: ${product.nombreEmpresa}</p>
            <p>Emprendedor: ${product.nombreEmprendedor}</p>
            <p>Correo: ${product.correoEmpresa}</p>
            <img src="${product.imagen || "default-image.png"}" alt="${
            product.nombre
          }" width="100">
            <button onclick="deleteProduct(${product.codigo})">Eliminar</button>
            <button onclick="showUpdateForm(${
              product.codigo
            })">Actualizar</button>
            <form id="update-form" style="display:none;">
              <label for="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" value="${
                product.nombre
              }" required>
              <label for="precioVenta">Precio:</label>
              <input type="number" id="precioVenta" name="precioVenta" value="${
                product.precioVenta
              }" required>
              <label for="stock">Stock:</label>
              <input type="number" id="stock" name="stock" value="${
                product.stock
              }" required disabled>
              <button type="submit">Actualizar</button>
            </form>
          `;

          const updateForm = document.getElementById("update-form");
          if (updateForm) {
            updateForm.addEventListener("submit", (e) => {
              e.preventDefault();
              const formData = new FormData(updateForm);
              const data = {
                nombre: formData.get("nombre"),
                precioVenta: parseFloat(formData.get("precioVenta")),
              };
              fetch(`/productos/${codigo}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then(() => {
                  alert("Producto actualizado");
                  window.location.reload();
                })
                .catch((err) => alert("Error: " + err.message));
            });
          }
        }
      });
  }
});

function deleteProduct(codigo) {
  fetch(`/productos/${codigo}`, {
    method: "DELETE",
  })
    .then(() => {
      alert("Producto eliminado");
      window.location.href = "index.html";
    })
    .catch((err) => alert("Error: " + err.message));
}

function showUpdateForm() {
  const form = document.getElementById("update-form");
  if (form) {
    form.style.display = "block";
  }
}
