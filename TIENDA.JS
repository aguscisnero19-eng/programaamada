let inventarioRopa = [];
let inventarioZapatillas = [];
let categoriaActual = "";
let historialVentas = [];

// ───────────────────────────
// MOSTRAR CATEGORÍA 
// ───────────────────────────
function mostrarCategoria(categoria) {
    // Guarda la categoría actual
    categoriaActual = categoria;

    // Mostrar barra superior y título (usamos clase 'oculto' para el contenedor principal)
    document.getElementById("barraSuperior").style.display = "block";
    document.getElementById("tituloCategoriaBarra").textContent =
        categoria === "ropa" ? "Categoría: Ropa" : "Categoría: Zapatillas";

    // Ocultar menú principal y mostrar el contenedor de categorías
    document.getElementById("menuPrincipal").style.display = "none";
    document.getElementById("contenedorCategorias").classList.remove("oculto");

    // Título principal
    document.getElementById("tituloCategoria").textContent =
        categoria === "ropa" ? "👗 Ropa" : "👟 Zapatillas";

    // Al entrar a una categoría, limpiamos estados viejos
    // ocultar mensajes y buscador
    if (document.getElementById("msgRegistrar")) document.getElementById("msgRegistrar").innerText = "";
    if (document.getElementById("msgVenta")) document.getElementById("msgVenta").innerText = "";
    if (document.getElementById("msgLocal")) document.getElementById("msgLocal").innerText = "";
    if (document.getElementById("buscadorInventario")) document.getElementById("buscadorInventario").value = "";

    // Aseguramos que las vistas de registro/venta muestran los campos correctos
    // (no mostramos la sección registrar por defecto, mostramos inventario)
    mostrarSeccion("inventario");
}



function volverMenu() {
    // Reiniciamos la categoría actual para evitar estados colgantes
    categoriaActual = "";

    // Ocultar contenedor de categorías y mostrar menú principal
    document.getElementById("contenedorCategorias").classList.add("oculto");
    document.getElementById("menuPrincipal").style.display = "block";
    document.getElementById("barraSuperior").style.display = "none";

    // Oculta TODAS las secciones (registro, inventario, venta)
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');

    // Asegurarse de ocultar los formularios específicos de categoría
    if (document.getElementById("camposRegistrarRopa")) document.getElementById("camposRegistrarRopa").style.display = "none";
    if (document.getElementById("camposRegistrarZapatillas")) document.getElementById("camposRegistrarZapatillas").style.display = "none";
    if (document.getElementById("camposVentaRopa")) document.getElementById("camposVentaRopa").style.display = "none";
    if (document.getElementById("camposVentaZapatillas")) document.getElementById("camposVentaZapatillas").style.display = "none";

    // Limpiar mensajes y buscador para estado "fresh"
    if (document.getElementById("msgRegistrar")) document.getElementById("msgRegistrar").innerText = "";
    if (document.getElementById("msgVenta")) document.getElementById("msgVenta").innerText = "";
    if (document.getElementById("msgLocal")) document.getElementById("msgLocal").innerText = "";
    if (document.getElementById("buscadorInventario")) {
        document.getElementById("buscadorInventario").value = "";
        document.getElementById("buscadorInventario").placeholder = "Buscar producto...";
    }

    // Opcional: Vaciar la tabla visual para evitar mostrar datos que parezcan "mezclados"
    let tbody = document.querySelector("#tablaInventario tbody");
    if (tbody) tbody.innerHTML = "";
}



function mostrarSeccion(seccion) {
    // Ocultamos todas las secciones primero
    document.querySelectorAll(".seccion").forEach(s => s.style.display = "none");

    // Si no hay categoría seleccionada y el usuario intenta ver registro/venta, no mostrar campos específicos
    if (!categoriaActual && (seccion === "registrar" || seccion === "venta")) {
        // simplemente mostramos un mensaje o redirigimos al inventario vacío
        document.getElementById("inventario").style.display = "block";
        return;
    }

    // Mostrar la sección solicitada
    const el = document.getElementById(seccion);
    if (el) el.style.display = "block";

    // Mostrar/ocultar campos de registrar según la categoría actual
    if (seccion === "registrar") {
        if (categoriaActual === "ropa") {
            document.getElementById("camposRegistrarRopa").style.display = "block";
            document.getElementById("camposRegistrarZapatillas").style.display = "none";
        } else if (categoriaActual === "zapatillas") {
            document.getElementById("camposRegistrarRopa").style.display = "none";
            document.getElementById("camposRegistrarZapatillas").style.display = "block";
        }
    }

    // Mostrar/ocultar campos de venta según la categoría actual
    if (seccion === "venta") {
        if (categoriaActual === "ropa") {
            document.getElementById("camposVentaRopa").style.display = "block";
            document.getElementById("camposVentaZapatillas").style.display = "none";
        } else if (categoriaActual === "zapatillas") {
            document.getElementById("camposVentaRopa").style.display = "none";
            document.getElementById("camposVentaZapatillas").style.display = "block";
        }
    }
}

// ───────────────────────────
// OBTENER INVENTARIO SEGÚN CATEGORÍA
// ───────────────────────────
function obtenerInventario() {
    return categoriaActual === "ropa"
        ? inventarioRopa
        : inventarioZapatillas;
}

// ───────────────────────────
// REGISTRAR PRODUCTO (CORREGIDA CON IDs ESPECÍFICOS)
// ───────────────────────────
function registrarProducto() {
    let nombre, talla, precio, cantidad, color;
    let inventario = obtenerInventario();
    const esRopa = categoriaActual === "ropa";
    const msg = document.getElementById("msgRegistrar");

    if (esRopa) {
        nombre = document.getElementById("nombreRopa").value.trim();
        talla = document.getElementById("tallaRopa").value.trim();
        precio = parseFloat(document.getElementById("precioRopa").value);
        cantidad = parseInt(document.getElementById("cantidadRopa").value);
        color = "N/A"; // No es relevante para Ropa
    } else {
        nombre = document.getElementById("nombreZapatilla").value.trim();
        talla = document.getElementById("tallaZapatilla").value.trim();
        color = document.getElementById("colorZapatilla").value.trim();
        precio = parseFloat(document.getElementById("precioZapatilla").value);
        cantidad = parseInt(document.getElementById("cantidadZapatilla").value);
    }
    
    // 1. VALIDACIÓN
    let camposIncompletos = !nombre || isNaN(precio) || !talla || isNaN(cantidad) || cantidad <= 0;
    if (!esRopa) { // Si es ZAPATILLAS, el color es obligatorio
        camposIncompletos = camposIncompletos || !color;
    }
    
    if (camposIncompletos) {
        msg.innerText = "Complete todos los campos de registro correctamente.";
        return;
    }

    if (esRopa) {
        // Lógica simple para ROPA
        inventario.push({ nombre, talla, precio, cantidad });
    } else {
        // Lógica compleja para ZAPATILLAS (Tu lógica anterior, con los nuevos datos)
        let productoBase = inventario.find(item => item.nombre.toLowerCase() === nombre.toLowerCase());

        if (productoBase) {
            let talleExistente = productoBase.talles.find(t => t.talle === talla);
            
            if (talleExistente) {
                let colorExistente = talleExistente.colores.find(c => c.color.toLowerCase() === color.toLowerCase());

                if (colorExistente) {
                    colorExistente.cantidad += cantidad;
                } else {
                    talleExistente.colores.push({ color: color, cantidad: cantidad });
                }
            } else {
                productoBase.talles.push({
                    talle: talla,
                    colores: [{ color: color, cantidad: cantidad }]
                });
            }
            // Actualizar el precio base al último precio registrado (opcional)
            productoBase.precio = precio; 

        } else {
            // Producto base NO existe: crear el producto completo
            inventario.push({
                nombre: nombre,
                precio: precio,
                talles: [{
                    talle: talla,
                    colores: [{ color: color, cantidad: cantidad }]
                }]
            });
        }
    }
    
    msg.innerText = "Producto registrado ✔";

// 4. Limpiar campos usando los IDs específicos
    if (esRopa) {
        document.getElementById("nombreRopa").value = "";
        document.getElementById("tallaRopa").value = "";
        document.getElementById("precioRopa").value = "";
        document.getElementById("cantidadRopa").value = "";
        // Aseguramos que el campo Color de Zapatillas no interfiera
        if(document.getElementById("colorZapatilla")) document.getElementById("colorZapatilla").value = ""; 
    } else {
        document.getElementById("nombreZapatilla").value = "";
        document.getElementById("tallaZapatilla").value = "";
        document.getElementById("colorZapatilla").value = ""; // 👈 ESTO ES CRUCIAL
        document.getElementById("precioZapatilla").value = "";
        document.getElementById("cantidadZapatilla").value = "";
        // Aseguramos que los campos de Ropa no interfieran
        if(document.getElementById("nombreRopa")) document.getElementById("nombreRopa").value = ""; 
    }

    guardarEnLocalStorage(); 
    actualizarTabla(); 
}

// ───────────────────────────
// ACTUALIZAR TABLA (VERSIÓN FINAL LIMPIA)
// ───────────────────────────

function actualizarTabla() {
    // Limpia el buscador al actualizar la tabla
    if (document.getElementById("buscadorInventario")) {
        document.getElementById("buscadorInventario").value = "";
    }

    // 🟢 CORRECCIÓN 1: Dejar solo una vez la asignación del placeholder
    document.getElementById("buscadorInventario").placeholder = 
        (categoriaActual === "ropa") 
            ? "Buscar Ropa por Nombre o Talla..." 
            : "Buscar Zapatilla por Nombre, Talla o Color...";
            
    let inventario = obtenerInventario();
    let tbody = document.querySelector("#tablaInventario tbody");
    tbody.innerHTML = "";
    

    if (categoriaActual === "ropa") {
        // Lógica simple para ROPA
        inventario.forEach((item, index) => {
            let fila = `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.talla}</td>
                    <td>N/A</td> 
                    <td>$${item.precio}</td>
                    <td>${item.cantidad}</td>
                    <td>
                        <button onclick="editarProducto(${index})">✏ Editar</button>
                        <button onclick="eliminarProducto(${index})">🗑 Eliminar</button>
                    </td>
                </tr>`;
            tbody.innerHTML += fila;
        });

    } else {
        // Lógica compleja para ZAPATILLAS (Se ejecuta cuando categoriaActual es "zapatillas")
        inventario.forEach((productoBase) => {
            productoBase.talles.forEach(talle => {
                talle.colores.forEach(colorItem => {
                    let fila = `
                        <tr>
                            <td>${productoBase.nombre}</td>
                            <td>${talle.talle}</td>
                            <td>${colorItem.color}</td> 
                            <td>$${productoBase.precio}</td>
                            <td>${colorItem.cantidad}</td>
                            <td>
                                <button onclick="editarZapatilla('${productoBase.nombre}', '${talle.talle}', '${colorItem.color}')">✏ Editar</button>
                                <button onclick="eliminarZapatilla('${productoBase.nombre}', '${talle.talle}', '${colorItem.color}')">🗑 Eliminar</button>
                            </td>
                        </tr>`;
                    tbody.innerHTML += fila;
                });
            });
        });
    }
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

// ───────────────────────────
// ELIMINAR ZAPATILLA (Por Nombre, Talle y Color)
// ───────────────────────────
function eliminarZapatilla(nombre, talla, color) {
    let inventario = obtenerInventario();
    
    if (!confirm(`¿Seguro que deseas eliminar la variación ${nombre} - Talle ${talla} - Color ${color}?`)) {
        return;
    }

    let productoBase = inventario.find(item => item.nombre === nombre);
    if (!productoBase) return;

    let talleExistente = productoBase.talles.find(t => t.talle === talla);
    if (!talleExistente) return;

    // Eliminar el color específico
    talleExistente.colores = talleExistente.colores.filter(c => c.color !== color);

    // Opcional: Si no quedan colores en el talle, eliminar el talle
    if (talleExistente.colores.length === 0) {
        productoBase.talles = productoBase.talles.filter(t => t.talle !== talla);
    }
    
    // Opcional: Si no quedan talles, eliminar el producto base
    if (productoBase.talles.length === 0) {
        // Aquí se debe reasignar el array inventarioZapatillas, ya que 'inventario' es una referencia al array principal
        inventarioZapatillas = inventarioZapatillas.filter(p => p.nombre !== nombre);
    }

    guardarEnLocalStorage();
    actualizarTabla();
}

// ───────────────────────────
// EDITAR ZAPATILLA (Por Nombre, Talle y Color)
// ───────────────────────────
function editarZapatilla(nombre, talla, color) {
    let inventario = obtenerInventario();
    
    // 1. Encontrar la variación
    let productoBase = inventario.find(item => item.nombre === nombre);
    let talleExistente = productoBase.talles.find(t => t.talle === talla);
    let colorExistente = talleExistente.colores.find(c => c.color === color);

    // 2. Pedir nuevos datos (usando prompt para seguir el estilo de tu código)
    let nuevoPrecio = parseFloat(prompt(`Nuevo precio para ${nombre} (actual $${productoBase.precio}):`, productoBase.precio));
    if (isNaN(nuevoPrecio) || nuevoPrecio === null) return;

    let nuevaCantidad = parseInt(prompt(`Nueva cantidad para ${nombre} - Talle ${talle} - Color ${color} (actual ${colorExistente.cantidad}):`, colorExistente.cantidad));
    if (isNaN(nuevaCantidad) || nuevaCantidad === null) return;

    // 3. Actualizar
    productoBase.precio = nuevoPrecio;
    colorExistente.cantidad = nuevaCantidad;

    guardarEnLocalStorage();
    actualizarTabla();
}

// ───────────────────────────
// BUSCAR PRODUCTO (VERSIÓN FINAL)
// ───────────────────────────
function buscarProducto() {
    let texto = document.getElementById("buscadorInventario").value.toLowerCase();
    let inventario = obtenerInventario();
    let tbody = document.querySelector("#tablaInventario tbody");
    tbody.innerHTML = "";
    
    const esRopa = categoriaActual === "ropa";

    if (esRopa) {
        // 🔍 Lógica simple para ROPA
        let productosFiltrados = inventario.filter((item, index) =>
            item.nombre.toLowerCase().includes(texto) ||
            item.talla.toLowerCase().includes(texto)
        );
        
        // El 'index' aquí es la posición real en el array inventarioRopa
        productosFiltrados.forEach((item, index) => {
            // Necesitamos encontrar el índice real del producto filtrado en el inventarioRopa
            const realIndex = inventario.findIndex(p => p.nombre === item.nombre && p.talla === item.talla);

            let fila = `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.talla}</td>
                    <td>N/A</td> 
                    <td>$${item.precio}</td>
                    <td>${item.cantidad}</td>
                    <td>
                        <button onclick="editarProducto(${realIndex})">✏ Editar</button>
                        <button onclick="eliminarProducto(${realIndex})">🗑 Eliminar</button>
                    </td>
                </tr>`;
            tbody.innerHTML += fila;
        });

    } else {
        // 👟 Lógica compleja para ZAPATILLAS (aplana y filtra)
        inventario.forEach((productoBase) => {
            productoBase.talles.forEach(talle => {
                talle.colores.forEach(colorItem => {
                    
                    if (
                        productoBase.nombre.toLowerCase().includes(texto) ||
                        talle.talle.toLowerCase().includes(texto) ||
                        colorItem.color.toLowerCase().includes(texto)
                    ) {
                        // Muestra la fila aplanada si coincide
                        let fila = `
                            <tr>
                                <td>${productoBase.nombre}</td>
                                <td>${talle.talle}</td>
                                <td>${colorItem.color}</td>
                                <td>$${productoBase.precio}</td>
                                <td>${colorItem.cantidad}</td>
                                <td>
                                    <button onclick="editarZapatilla('${productoBase.nombre}', '${talle.talle}', '${colorItem.color}')">✏ Editar</button>
                                    <button onclick="eliminarZapatilla('${productoBase.nombre}', '${talle.talle}', '${colorItem.color}')">🗑 Eliminar</button>
                                </td>
                            </tr>`;
                        tbody.innerHTML += fila;
                    }
                });
            });
        });
    }
}
function mostrarHistorial() {
    let tbody = document.querySelector("#tablaHistorial tbody");
    tbody.innerHTML = "";

    historialVentas.forEach(v => {
        let row = `
            <tr>
                <td>${v.categoria}</td>
                <td>${v.nombre}</td>
                <td>${v.talla || "N/A"}</td>
                <td>${v.color || "N/A"}</td>
                <td>${v.cantidad}</td>
                <td>$${v.precioUnitario}</td>
                <td>$${v.total}</td>
                <td>${v.fecha}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// ───────────────────────────
// REALIZAR VENTA (CORREGIDA la eliminación del producto base de Zapatillas)
// ───────────────────────────
function realizarVenta() {
    let inventario = obtenerInventario();
    const msgVenta = document.getElementById("msgVenta");
    const esRopa = categoriaActual === "ropa";

    msgVenta.innerText = "";

    // ─────────────────────────────
    //        VENTA DE ROPA
    // ─────────────────────────────
    if (esRopa) {
        let nombre = document.getElementById("buscarNombre").value.trim();
        let cantidadVender = parseInt(document.getElementById("cantidadVenta").value);

        if (!nombre || isNaN(cantidadVender) || cantidadVender <= 0) {
            msgVenta.innerText = "Complete nombre y cantidad válida.";
            return;
        }

        let producto = inventario.find(
            item => item.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if (!producto) {
            msgVenta.innerText = "Producto de ropa no encontrado.";
            return;
        }

        if (producto.cantidad < cantidadVender) {
            msgVenta.innerText = "Stock insuficiente.";
            return;
        }

        // Descontar
        producto.cantidad -= cantidadVender;

        // Eliminar si queda en 0
        if (producto.cantidad === 0) {
            inventarioRopa = inventarioRopa.filter(
                p => p.nombre.toLowerCase() !== nombre.toLowerCase()
            );
        }

        // Guardar en historial
        historialVentas.push({
            categoria: "ropa",
            nombre: producto.nombre,
            talla: producto.talla,
            color: "",
            cantidad: cantidadVender,
            precioUnitario: producto.precio,
            total: producto.precio * cantidadVender,
            fecha: new Date().toLocaleString()
        });

    } 
    // ─────────────────────────────
    //     VENTA DE ZAPATILLAS
    // ─────────────────────────────
    else {
        let nombre = document.getElementById("buscarNombreZ").value.trim();
        let talla = document.getElementById("tallaVentaZ").value.trim();
        let color = document.getElementById("colorVentaZ").value.trim();
        let cantidadVender = parseInt(document.getElementById("cantidadVentaZ").value);

        if (!nombre || !talla || !color || isNaN(cantidadVender) || cantidadVender <= 0) {
            msgVenta.innerText = "Complete nombre, talla, color y cantidad válida.";
            return;
        }

        let productoBase = inventario.find(
            item => item.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if (!productoBase) {
            msgVenta.innerText = "Zapatilla no encontrada.";
            return;
        }

        let talleExistente = productoBase.talles.find(t => t.talle === talla);
        if (!talleExistente) {
            msgVenta.innerText = "Talla no encontrada.";
            return;
        }

        let colorExistente = talleExistente.colores.find(
            c => c.color.toLowerCase() === color.toLowerCase()
        );
        if (!colorExistente) {
            msgVenta.innerText = "Color no encontrado.";
            return;
        }

        if (colorExistente.cantidad < cantidadVender) {
            msgVenta.innerText = "Stock insuficiente de ese color.";
            return;
        }

        // Descontar cantidad
        colorExistente.cantidad -= cantidadVender;

        // Eliminar color/talle/producto según corresponda
        if (colorExistente.cantidad === 0) {
            talleExistente.colores = talleExistente.colores.filter(
                c => c.color.toLowerCase() !== color.toLowerCase()
            );

            if (talleExistente.colores.length === 0) {
                productoBase.talles = productoBase.talles.filter(
                    t => t.talle !== talla
                );

                if (productoBase.talles.length === 0) {
                    inventarioZapatillas = inventarioZapatillas.filter(
                        p => p.nombre.toLowerCase() !== nombre.toLowerCase()
                    );
                }
            }
        }

        // Guardar en historial
        historialVentas.push({
            categoria: "zapatillas",
            nombre: productoBase.nombre,
            talla: talla,
            color: color,
            cantidad: cantidadVender,
            precioUnitario: productoBase.precio,
            total: productoBase.precio * cantidadVender,
            fecha: new Date().toLocaleString()
        });
    }
    guardarHistorial();


    // ─────────────────────────────
    //  LIMPIEZA FINAL Y ACTUALIZAR
    // ─────────────────────────────
    msgVenta.innerText = "Venta realizada ✔";

    document.getElementById("buscarNombre").value = "";
    document.getElementById("cantidadVenta").value = "";

    document.getElementById("buscarNombreZ").value = "";
    document.getElementById("tallaVentaZ").value = "";
    document.getElementById("colorVentaZ").value = "";
    document.getElementById("cantidadVentaZ").value = "";

    guardarEnLocalStorage();
    actualizarTabla();
    verificarStockBajo(); // 🔔 ALERTA DE STOCK BAJO
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
function guardarHistorial() {
    localStorage.setItem("historialVentas", JSON.stringify(historialVentas));
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
function cargarHistorial() {
    let data = localStorage.getItem("historialVentas");
    if (data) historialVentas = JSON.parse(data);
}

function borrarInventario() {
    localStorage.removeItem("inventario_" + categoriaActual);

    if (categoriaActual === "ropa") inventarioRopa = [];
    else inventarioZapatillas = [];

    actualizarTabla();

    document.getElementById("msgLocal").innerText = "Inventario borrado ✔";
}

// ───────────────────────────
// FUNCIÓN AUXILIAR PARA EXPORTACIÓN
// ───────────────────────────
function aplanarInventarioZapatillas(inventario) {
    let inventarioAplanado = [];
    inventario.forEach(productoBase => {
        productoBase.talles.forEach(talle => {
            talle.colores.forEach(colorItem => {
                inventarioAplanado.push({
                    Nombre: productoBase.nombre,
                    Talla: talle.talle,
                    Color: colorItem.color,
                    Precio: productoBase.precio,
                    Cantidad: colorItem.cantidad
                });
            });
        });
    });
    return inventarioAplanado;
}


// ───────────────────────────
// EXPORTAR A EXCEL (MODIFICADA)
// ───────────────────────────
function exportarExcel() {
    let inventario = obtenerInventario();
    let dataExportar;

    if (categoriaActual === "zapatillas") {
        dataExportar = aplanarInventarioZapatillas(inventario);
    } else {
        dataExportar = inventario; // Usa la estructura simple para ropa
    }

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(dataExportar);

    XLSX.utils.book_append_sheet(wb, ws, "Inventario");

    XLSX.writeFile(wb, `inventario_${categoriaActual}.xlsx`);
}

// ───────────────────────────
// EXPORTAR A PDF (MODIFICADA)
// ───────────────────────────
function exportarPDF() {
    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();
    let inventario = obtenerInventario();
    let dataExportar;
    let headers;

    if (categoriaActual === "zapatillas") {
        dataExportar = aplanarInventarioZapatillas(inventario);
        headers = [["Nombre", "Talla", "Color", "Precio", "Cantidad"]];
        
        doc.autoTable({
            head: headers,
            body: dataExportar.map(p => [p.Nombre, p.Talla, p.Color, p.Precio, p.Cantidad])
        });

    } else {
        // Lógica para Ropa
        dataExportar = inventario;
        headers = [["Nombre", "Talla", "Precio", "Cantidad"]];

        doc.autoTable({
            head: headers,
            body: dataExportar.map(p => [p.nombre, p.talla, p.precio, p.cantidad])
        });
    }

    doc.text("Inventario - " + categoriaActual.toUpperCase(), 10, 10);
    doc.save(`inventario_${categoriaActual}.pdf`);
}
/* ==========================================================
   SISTEMA DE ACCESO POR PASSWORD
========================================================== */

const PASSWORD_CORRECTO = "1808"; // podés cambiarla

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


