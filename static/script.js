console.log("Panadería UNSA - Versión Estática");
let carrito = [];
let productosData = []; // Guardará los productos del JSON

const lista = document.getElementById("listaCarrito");
const total = document.getElementById("total");
const contador = document.getElementById("contador");
const botonPedido = document.getElementById("registrarPedido");
const buscador = document.getElementById("buscador");
const contenedorProductos = document.getElementById("productos");

// 1. CARGAR PRODUCTOS DESDE EL ARCHIVO JSON
fetch("productos.json")
    .then(res => res.json())
    .then(data => {
        productosData = data;
        renderizarProductos(productosData);
    })
    .catch(err => console.error("Error cargando productos.json:", err));

// 2. FUNCIÓN PARA MOSTRAR LAS CARDS EN EL HTML
function renderizarProductos(productos) {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";

    productos.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-nombre", p.nombre);
        card.setAttribute("data-categoria", p.categoria);

        card.innerHTML = `
            <img src="static/${p.imagen}" alt="${p.nombre}">
            <div class="etiqueta">${p.etiqueta}</div>
            <div class="info">
                <h2>${p.nombre}</h2>
                <p class="categoria">${p.categoria}</p>
                <p>S/. ${p.precio.toFixed(2)}</p>
            </div>
            <p>Stock: ${p.stock}</p>
            <button class="agregar" 
                    data-id="${p.id}" 
                    data-nombre="${p.nombre}" 
                    data-precio="${p.precio}">
                Agregar
            </button>
        `;
        contenedorProductos.appendChild(card);
    });

    // Volver a enlazar los eventos de los botones "Agregar" recién creados
    asignarEventosAgregar();
}

// 3. ASIGNAR CLICKS PARA EL CARRITO
function asignarEventosAgregar() {
    const botones = document.querySelectorAll(".agregar");
    botones.forEach(boton => {
        boton.onclick = () => {
            const producto = {
                id: Number(boton.dataset.id),
                nombre: Boton.dataset.nombre,
                precio: Number(boton.dataset.precio)
            };

            let existe = carrito.find(p => p.id == producto.id);
            if (existe) {
                existe.cantidad++;
            } else {
                producto.cantidad = 1;
                carrito.push(producto);
            }
            actualizarCarrito();
        };
    });
}

// 4. ACTUALIZAR VISTA DEL CARRITO
function actualizarCarrito() {
    lista.innerHTML = "";
    let suma = 0;

    carrito.forEach((producto, index) => {
        suma += producto.precio * producto.cantidad;
        const div = document.createElement("div");
        div.innerHTML = `
            <p>
                <strong>${producto.nombre}</strong><br>
                Cantidad: 
                <button type="button" onclick="restar(${index})">-</button>
                ${producto.cantidad}
                <button type="button" onclick="sumar(${index})">+</button>
                <br>
                Subtotal: S/.${(producto.precio * producto.cantidad).toFixed(2)}
                <button type="button" onclick="eliminar(${index})">❌</button>
            </p>
        `;
        lista.appendChild(div);
    });

    if (carrito.length == 0) {
        lista.innerHTML = "<p>No hay productos.</p>";
    }

    total.innerHTML = "S/." + suma.toFixed(2);
    contador.innerHTML = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

window.eliminar = function(i) {
    carrito.splice(i, 1);
    actualizarCarrito();
}

window.sumar = function(i) {
    carrito[i].cantidad++;
    actualizarCarrito();
}

window.restar = function(i) {
    if (carrito[i].cantidad > 1) {
        carrito[i].cantidad--;
    } else {
        carrito.splice(i, 1);
    }
    actualizarCarrito();
}

// 5. BUSCADOR EN TIEMPO REAL
if (buscador) {
    buscador.addEventListener("input", () => {
        let texto = buscador.value.toLowerCase();
        let cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            let nombre = card.dataset.nombre.toLowerCase();
            let categoria = card.dataset.categoria.toLowerCase();
            if (nombre.includes(texto) || categoria.includes(texto)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}

// 6. FILTROS DE CATEGORÍAS
const filtros = document.querySelectorAll(".filtro");
filtros.forEach(boton => {
    boton.addEventListener("click", () => {
        let categoria = boton.dataset.categoria;
        let cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            let cat = card.dataset.categoria;
            if (categoria === "todos" || cat === categoria) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});

// 7. REGISTRAR PEDIDO (Simulado para GitHub Pages)
if (botonPedido) {
    botonPedido.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }
        alert("¡Pedido simulado con éxito! (En GitHub Pages no se puede modificar el archivo JSON permanentemente).");
        carrito = [];
        actualizarCarrito();
    });
}

// BOTÓN VOLVER ARRIBA
const btnArriba = document.getElementById("btnArriba");
if (btnArriba) {
    btnArriba.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}