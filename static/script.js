console.log("Panadería UNSA - Versión Estática Activa (Fix IDs)");
let carrito = [];
let productosData = []; 

const lista = document.getElementById("listaCarrito");
const total = document.getElementById("total");
const contador = document.getElementById("contador");
const botonPedido = document.getElementById("registrarPedido");
const buscador = document.getElementById("buscador");
const contenedorProductos = document.getElementById("productos");

// 1. CARGAR PRODUCTOS
fetch("productos.json")
    .then(res => res.json())
    .then(data => {
        productosData = data;
        renderizarProductos(productosData);
    })
    .catch(err => console.error("Error cargando productos.json:", err));

// 2. RENDERIZAR CARDS
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

    asignarEventosAgregar();
}

// 3. ASIGNAR CLICKS Y BAJAR STOCK (CORREGIDO)
function asignarEventosAgregar() {
    const botones = document.querySelectorAll(".agregar");
    botones.forEach(boton => {
        boton.onclick = () => {
            const idProducto = boton.dataset.id; // Tomamos el ID tal cual
            
            // Usamos == para que funcione aunque el JSON tenga "1" o 1
            let prodEnData = productosData.find(p => p.id == idProducto);
            
            if (prodEnData) {
                if (prodEnData.stock <= 0) {
                    alert("¡Lo sentimos! Ya no queda stock de " + prodEnData.nombre);
                    return;
                }
                
                // Restar 1 al stock localmente
                prodEnData.stock--;
                
                // Agregar al carrito
                let existe = carrito.find(p => p.id == idProducto);
                if (existe) {
                    existe.cantidad++;
                } else {
                    carrito.push({
                        id: prodEnData.id,
                        nombre: prodEnData.nombre,
                        precio: Number(prodEnData.precio),
                        cantidad: 1
                    });
                }
                
                renderizarProductos(productosData);
                actualizarCarrito();
            }
        };
    });
}

// 4. ACTUALIZAR CARRITO
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

    if (carrito.length === 0) {
        lista.innerHTML = "<p>No hay productos.</p>";
    }

    total.innerHTML = "S/." + suma.toFixed(2);
    contador.innerHTML = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

window.eliminar = function(i) {
    let prodEnData = productosData.find(p => p.id == carrito[i].id);
    if (prodEnData) prodEnData.stock += carrito[i].cantidad;
    
    carrito.splice(i, 1);
    renderizarProductos(productosData);
    actualizarCarrito();
}

window.sumar = function(i) {
    let prodEnData = productosData.find(p => p.id == carrito[i].id);
    if (prodEnData && prodEnData.stock > 0) {
        prodEnData.stock--;
        carrito[i].cantidad++;
        renderizarProductos(productosData);
        actualizarCarrito();
    } else {
        alert("No hay más stock disponible, lo chento🥺");
    }
}

window.restar = function(i) {
    let prodEnData = productosData.find(p => p.id == carrito[i].id);
    if (prodEnData) prodEnData.stock++;

    if (carrito[i].cantidad > 1) {
        carrito[i].cantidad--;
    } else {
        carrito.splice(i, 1);
    }
    renderizarProductos(productosData);
    actualizarCarrito();
}

// 5. BUSCADOR
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

// 6. FILTROS
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

// 7. REGISTRAR PEDIDO
if (botonPedido) {
    botonPedido.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }
        alert("¡Pedido simulado con éxito! Tu orden ha sido procesada, animese a comprar unito mas😁.");
        carrito = [];
        actualizarCarrito();
    });
}

// VOLVER ARRIBA
const btnArriba = document.getElementById("btnArriba");
if (btnArriba) {
    btnArriba.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}