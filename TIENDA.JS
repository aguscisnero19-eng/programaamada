let inventarioRopa = [];
let inventarioZapatillas = [];
let categoriaActual = "";

function mostrarCategoria(tipo) {

    if (!accesoPermitido) {
        mostrarToast("Debe ingresar la contraseña para acceder", "error");
        return;
    }

    categoriaActual = tipo; // guarda la categoría elegida
// Cargar inventario automáticamente si existe en LocalStorage
let almacenado = localStorage.getItem("inventario_" + categoriaActual);
if (almacenado) {
    if (categoriaActual === "ropa") {
        inventarioRopa = JSON.parse(almacenado);
    } else {
        inventarioZapatillas = JSON.parse(almacenado);
    }
}

    // Oculta menú principal
    document.getElementById("menuPrincipal").style.display = "none";

    // Muestra barra superior (si la usás)
    document.getElementById("barraSuperior").style.display = "block";

    // Muestra el contenedor de las secciones
    document.getElementById("contenedorCategorias").classList.remove("oculto");

    // Cambia el título de la categoría
    document.getElementById("tituloCategoria").textContent =
        tipo === "ropa" ? "Ropa" : "Zapatillas";

    // Muestra inventario por defecto
    mostrarSeccion("inventario");

    // Actualiza tabla
    actualizarTabla();
}



function volverMenu() {
    document.getElementById("contenedorCategorias").classList.add("oculto");
    document.getElementById("menuPrincipal").style.display = "block";
    document.getElementById("barraSuperior").style.display = "none";

    // Oculta TODAS las secciones
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
}



function mostrarSeccion(id) {

    if (!accesoPermitido) {
        mostrarToast("Acceso denegado. Ingrese la contraseña.", "error");
        return;
    }

    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// ───────────────────────────
// OBTENER INVENTARIO SEGÚN CATEGORÍA
// ───────────────────────────
function obtenerInventario() {
    return categoriaActual === "ropa" ? inventarioRopa : inventarioZapatillas;
}

// ───────────────────────────
// REGISTRAR PRODUCTO
// ───────────────────────────
function registrarProducto() {
    let nombre = document.getElementById("nombre").value.trim();
    let talla = document.getElementById("talla").value.trim();
    let precio = parseFloat(document.getElementById("precio").value);
    let cantidad = parseInt(document.getElementById("cantidad").value);

    if (!nombre || !talla || isNaN(precio) || isNaN(cantidad)) {
        document.getElementById("msgRegistrar").innerText = "Complete todos los campos.";
        return;
    }

    let inventario = obtenerInventario();

    inventario.push({ nombre, talla, precio, cantidad });

    document.getElementById("msgRegistrar").innerText = "Producto registrado ✔";

    document.getElementById("nombre").value = "";
    document.getElementById("talla").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
}

// ───────────────────────────
// ACTUALIZAR TABLA
// ───────────────────────────
 function actualizarTabla() {

    // 🟢 Limpia el buscador al actualizar la tabla
    if (document.getElementById("buscadorInventario")) {
        document.getElementById("buscadorInventario").value = "";
    }

    let inventario = obtenerInventario();
    let tbody = document.querySelector("#tablaInventario tbody");

    tbody.innerHTML = "";
}
function actualizarTabla() {
    let inventario = obtenerInventario();
    let tbody = document.querySelector("#tablaInventario tbody");

    tbody.innerHTML = "";

    inventario.forEach((item, index) => {
        let fila = `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.talla}</td>
                <td>$${item.precio}</td>
                <td>${item.cantidad}</td>
                <td>
                    <button onclick="editarProducto(${index})">✏ Editar</button>
                    <button onclick="eliminarProducto(${index})">🗑 Eliminar</button>
                </td>
            </tr>`;
        tbody.innerHTML += fila;
    });
}
function editarProducto(index) {
    let inventario = obtenerInventario();
    let producto = inventario[index];

    let nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
    if (nuevoNombre === null) return;

    let nuevaTalla = prompt("Nueva talla:", producto.talla);
    if (nuevaTalla === null) return;

    let nuevoPrecio = parseFloat(prompt("Nuevo precio:", producto.precio));
    if (isNaN(nuevoPrecio)) return;

    let nuevaCantidad = parseInt(prompt("Nueva cantidad:", producto.cantidad));
    if (isNaN(nuevaCantidad)) return;

    inventario[index] = {
        nombre: nuevoNombre,
        talla: nuevaTalla,
        precio: nuevoPrecio,
        cantidad: nuevaCantidad
    };

    guardarEnLocalStorage();
    actualizarTabla();
}
function eliminarProducto(index) {
    let inventario = obtenerInventario();

    if (!confirm("¿Seguro que deseas eliminar este producto?")) {
        return;
    }

    inventario.splice(index, 1);

    guardarEnLocalStorage();
    actualizarTabla();
}
function buscarProducto() {
    let texto = document.getElementById("buscadorInventario").value.toLowerCase();
    let inventario = obtenerInventario();
    let tbody = document.querySelector("#tablaInventario tbody");

    tbody.innerHTML = "";

    inventario
        .filter(item =>
            item.nombre.toLowerCase().includes(texto) ||
            item.talla.toLowerCase().includes(texto)
        )
        .forEach((item, index) => {
            let fila = `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.talla}</td>
                    <td>$${item.precio}</td>
                    <td>${item.cantidad}</td>
                    <td>
                        <button onclick="editarProducto(${index})">✏ Editar</button>
                        <button onclick="eliminarProducto(${index})">🗑 Eliminar</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
}


// ───────────────────────────
// REALIZAR VENTA
// ───────────────────────────
function realizarVenta() {
    let nombre = document.getElementById("buscarNombre").value.trim();
    let cantidadVender = parseInt(document.getElementById("cantidadVenta").value);

    let inventario = obtenerInventario();

    let producto = inventario.find(item => item.nombre.toLowerCase() === nombre.toLowerCase());

    if (!producto) {
        document.getElementById("msgVenta").innerText = "Producto no encontrado.";
        return;
    }

    if (producto.cantidad < cantidadVender) {
        document.getElementById("msgVenta").innerText = "Stock insuficiente.";
        return;
    }

    producto.cantidad -= cantidadVender;

    document.getElementById("msgVenta").innerText = "Venta realizada ✔";

    actualizarTabla();
}

// ───────────────────────────
// LOCALSTORAGE INDEPENDIENTE POR CATEGORÍA
// ───────────────────────────
function guardarEnLocalStorage() {
    let productos = categoriaActual === "ropa" ? inventarioRopa : inventarioZapatillas;

    // Si no hay productos, NO guardar
    if (!productos || productos.length === 0) {
        document.getElementById("msgLocal").textContent =
            "⚠ No se puede guardar: no hay productos registrados.";
        return;
    }

    localStorage.setItem("inventario_" + categoriaActual, JSON.stringify(productos));

    document.getElementById("msgLocal").textContent =
        "✔ Inventario guardado correctamente.";
}



function cargarDesdeLocalStorage() {
    let data = localStorage.getItem("inventario_" + categoriaActual);

    if (data) {
        if (categoriaActual === "ropa") {
            inventarioRopa = JSON.parse(data);
        } else {
            inventarioZapatillas = JSON.parse(data);
        }
    }

    actualizarTabla();

    document.getElementById("msgLocal").innerText = "Inventario cargado ✔";
}

function borrarInventario() {
    localStorage.removeItem("inventario_" + categoriaActual);

    if (categoriaActual === "ropa") inventarioRopa = [];
    else inventarioZapatillas = [];

    actualizarTabla();

    document.getElementById("msgLocal").innerText = "Inventario borrado ✔";
}

// ───────────────────────────
// EXPORTAR A EXCEL
// ───────────────────────────
function exportarExcel() {
    let inventario = obtenerInventario();

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(inventario);

    XLSX.utils.book_append_sheet(wb, ws, "Inventario");

    XLSX.writeFile(wb, `inventario_${categoriaActual}.xlsx`);
}

// ───────────────────────────
// EXPORTAR A PDF
// ───────────────────────────
function exportarPDF() {
    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();
    let inventario = obtenerInventario();

    doc.text("Inventario - " + categoriaActual.toUpperCase(), 10, 10);

    doc.autoTable({
        head: [["Nombre", "Talla", "Precio", "Cantidad"]],
        body: inventario.map(p => [p.nombre, p.talla, p.precio, p.cantidad])
    });

    doc.save(`inventario_${categoriaActual}.pdf`);
}
/* ==========================================================
   SISTEMA DE ACCESO POR PASSWORD
========================================================== */

const PASSWORD_CORRECTO = "1234"; // podés cambiarla

let accesoPermitido = false;

function validarPassword() {
    const clave = document.getElementById("claveAcceso").value;
    const msg = document.getElementById("msgLogin");

    if (clave === PASSWORD_CORRECTO) {
        accesoPermitido = true;

        // Oculta login
        document.getElementById("loginScreen").style.display = "none";

        // Muestra menú principal
        document.getElementById("menuPrincipal").style.display = "block";

        msg.textContent = "";
    } else {
        msg.textContent = "❌ Contraseña incorrecta";
        msg.style.color = "red";
    }
}
