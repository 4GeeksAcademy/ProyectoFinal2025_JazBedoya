import React, { useEffect, useState } from "react";

export default function Carrito() {
  const [carrito, setCarrito] = useState({ items: [], total: 0 }); //Items: lista de lotes en el carrito, total:suma total de todos los lotes

  //Cuando el componente se carga por primera vez llama al cargarCarrito, se ejecuta una vez
  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = () => {
    const token = localStorage.getItem("jwt-token"); //agarra el token del usuario para autorizar

    //Hace un GET al carrito
    fetch("http://127.0.0.1:5000/carrito", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(resp => resp.json())
      .then(data => setCarrito(data)); //setCarrito actualiza el estado
  };

  //Actuliza la cantidas
  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;  //no permite cantidas menores a uno

    const token = localStorage.getItem("jwt-token"); 

    fetch(`http://127.0.0.1:5000/carrito/${id}`, {
      method: "PUT", //envia un PUT al backend con la cantidasd
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quantity: nuevaCantidad }) // se vueleve a cargar para mostrar el nuevo total
    })
      .then(resp => resp.json())
      .then(() => cargarCarrito());
  };

  

   //Eliminar un item con el id
  const eliminarItem = (id) => {
    const token = localStorage.getItem("jwt-token");

    fetch(`http://127.0.0.1:5000/carrito/${id}`, {
      method: "DELETE", // el backend borra ese elemento
      headers: { "Authorization": "Bearer " + token }
    })
      .then(resp => resp.json())
      .then(() => cargarCarrito()); // se recarga el carrito inmediatamente
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold" style={{ color: "#0B7A35" }}>Mi Carrito</h2>

      {carrito.items.length === 0 && (
        <div className="alert alert-info mt-3">
          Tu carrito está vacío. Ve al catálogo para agregar lotes.
        </div>
      )}

      {/* LISTA DE ITEMS */}
      {carrito.items.map((item) => (
        <div className="card p-3 mb-3 shadow-sm" key={item.id}>
          <div className="d-flex align-items-center">

            {/* IMAGEN */}
            <img
              src={item.ganado.image}
              alt="ganado"
              style={{
                width: "150px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />

            {/* INFO */}
            <div className="ms-3 w-100">

              <h5 className="mb-1">{item.ganado.title}</h5>
              <p className="text-success fw-bold mb-2">
                {item.ganado.price_per_head.toLocaleString()} Gs / cabeza
              </p>

              {/* CANTIDAD */}
              <div className="d-flex align-items-center mb-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => cambiarCantidad(item.id, item.quantity - 1)}
                >
                  -
                </button>

                <span className="mx-2 fw-bold">{item.quantity}</span>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => cambiarCantidad(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* ELIMINAR */}
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => eliminarItem(item.id)}
              >
                🗑️ Eliminar
              </button>

            </div>
          </div>
        </div>
      ))}

      {/* TOTAL Y MÉTODOS DE PAGO */}
      {carrito.items.length > 0 && (
        <div className="card p-4 shadow-lg mt-4">

          <h4 className="fw-bold">
            Total: {carrito.total.toLocaleString()} Gs
          </h4>

          {/* ICONOS DE TARJETAS */}
          <div className="d-flex gap-3 mt-3 mb-3">
          
            <img src="/public/visa1.png" alt="Visa" style={{ height: "15px" }} />
            <img src="/public/mastercard1.png" alt="Mastercard" style={{ height: "20px" }} />
          {/* <img src="/public/ueno.png" alt="Maestro" style={{ height: "35px" }} />*/}
          </div>

          <button className="btn btn-success w-100 py-2">
            Proceder al pago
          </button>
        </div>
      )}
    </div>
  );
}
