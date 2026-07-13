console.log("Panadería UNSSA");
let carrito = [];

const botones = document.querySelectorAll(".agregar");

const lista = document.getElementById("listaCarrito");

const total = document.getElementById("total");

const contador=document.getElementById("contador");

const botonPedido=document.getElementById("registrarPedido");

console.log(botonPedido);

actualizar()

botones.forEach(boton=>{

boton.addEventListener("click",()=>{

const producto={

id:Number(boton.dataset.id),

nombre:boton.dataset.nombre,

precio:Number(boton.dataset.precio)

};

let existe = carrito.find(p=>p.id==producto.id);


if(existe){

existe.cantidad++;

}else{

producto.cantidad=1;

carrito.push(producto);

}

actualizar();

});

});

function actualizar(){

lista.innerHTML="";

let suma=0;

carrito.forEach((producto,index)=>{


suma+=producto.precio * producto.cantidad;

const div=document.createElement("div");

div.innerHTML=`

<p>

${producto.nombre}

<br>

Cantidad:

<button onclick="restar(${index})">
-
</button>


${producto.cantidad}


<button onclick="sumar(${index})">
+
</button>


<br>

Subtotal:

S/.${producto.precio * producto.cantidad}


<button onclick="eliminar(${index})">

❌

</button>


</p>

`;

lista.appendChild(div);

});

if(carrito.length==0){

lista.innerHTML="<p>No hay productos.</p>";

}

total.innerHTML="S/."+suma.toFixed(2);

contador.innerHTML=carrito.length;

}

function eliminar(i){

carrito.splice(i,1);

actualizar();

}

const buscador = document.getElementById("buscador");

if(buscador){

buscador.addEventListener("keyup",()=>{

});

}

let texto = buscador.value.toLowerCase();

let productos = document.querySelectorAll(".card");


productos.forEach(producto=>{

let nombre = producto.dataset.nombre.toLowerCase();

let categoria = producto.dataset.categoria.toLowerCase();


if(nombre.includes(texto) || categoria.includes(texto)){

producto.style.display="block";

}else{

producto.style.display="none";

}

});


const filtros = document.querySelectorAll(".filtro");


filtros.forEach(boton=>{


boton.addEventListener("click",()=>{


let categoria = boton.dataset.categoria;


let productos = document.querySelectorAll(".card");


productos.forEach(producto=>{


let cat = producto.dataset.categoria;


if(categoria=="todos" || cat==categoria){

producto.style.display="block";

}else{

producto.style.display="none";

}


});


});


});

function sumar(i){

carrito[i].cantidad++;

actualizar();

}



function restar(i){

if(carrito[i].cantidad>1){

carrito[i].cantidad--;

}else{

carrito.splice(i,1);

}


actualizar();

}

botonPedido.addEventListener("click",()=>{


if(carrito.length==0){

alert("El carrito está vacío");

return;

}


fetch("/registrar_pedido",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(carrito)

})


.then(res=>res.json())


.then(data=>{

alert(data.mensaje);


if(data.mensaje=="Pedido registrado correctamente"){

carrito=[];

actualizar();

window.location.reload();

}

});

});

// =============================
// BOTÓN VOLVER ARRIBA
// =============================

const btnArriba = document.getElementById("btnArriba");

btnArriba.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});