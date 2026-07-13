from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime

app = Flask(__name__)

with open("productos.json", "r", encoding="utf-8") as archivo:
    productos = json.load(archivo)


@app.route("/")
def inicio():
    return render_template("index.html",
                           productos=productos)



@app.route("/registrar_pedido", methods=["POST"])
def registrar_pedido():

    pedido = request.json

    print("PEDIDO RECIBIDO:")
    print(pedido)


    for producto_pedido in pedido:

        for producto in productos:

            print("Comparando:")
            print(producto["id"], producto_pedido["id"])


            if producto["id"] == producto_pedido["id"]:


                if producto["stock"] >= producto_pedido["cantidad"]:

                    producto["stock"] -= producto_pedido["cantidad"]

                    print("STOCK ACTUAL:")
                    print(producto["nombre"], producto["stock"])
                else:

                    return jsonify({

                        "mensaje":
                        f"No hay suficiente stock de {producto['nombre']}"

                    }),400
                            
                                                
    with open("productos.json", "w", encoding="utf-8") as archivo:
        json.dump(productos, archivo, indent=4, ensure_ascii=False)
    
    with open("ventas.json","r",encoding="utf-8") as archivo:
        ventas=json.load(archivo)


    nueva_venta={

        "fecha":datetime.now().strftime("%d/%m/%Y %H:%M"),

        "productos":pedido

    }


    ventas.append(nueva_venta)


    with open("ventas.json","w",encoding="utf-8") as archivo:
        json.dump(ventas,archivo,indent=4,ensure_ascii=False)


    return jsonify({

        "mensaje":"Pedido registrado correctamente"

    })

if __name__=="__main__":
    app.run(debug=True)