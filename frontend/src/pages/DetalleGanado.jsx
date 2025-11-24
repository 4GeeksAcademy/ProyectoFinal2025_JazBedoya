//DetalleGanado.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetalleGanado() {
  const { id } = useParams();
  const [ganado, setGanado] = useState(null);

  const cargarGanado = async () => {
    try {
      const resp = await fetch(`http://127.0.0.1:5000/ganado/${id}`);
      const data = await resp.json();
      setGanado(data);
    } catch (err) {
      alert("Error al cargar el ganado");
    }
  };

  const agregarAlCarrito = async () => {
    try {
      const token = localStorage.getItem("jwt-token");

      const resp = await fetch("http://127.0.0.1:5000/carrito", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ganado_id: ganado.id,
          quantity: 1,
        }),
      });

      if (!resp.ok) throw new Error("Error al agregar al carrito");

      alert("Agregado al carrito");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    cargarGanado();
  }, []);

  if (!ganado) return <p>Cargando...</p>;

  return (
    <div className="row mt-4">
      <div className="col-md-6">
        <img src={ganado.image} alt="foto" className="img-fluid rounded shadow" />
      </div>

      <div className="col-md-6">
        <h2>{ganado.title}</h2>
        <p className="text-muted">{ganado.description}</p>

        <ul className="list-group">
          <li className="list-group-item"><strong>Raza:</strong> {ganado.breed}</li>
          <li className="list-group-item"><strong>Edad:</strong> {ganado.age} meses</li>
          <li className="list-group-item"><strong>Peso:</strong> {ganado.kg} kg</li>
          <li className="list-group-item"><strong>Precio por cabeza:</strong> ${ganado.price_per_head}</li>
          <li className="list-group-item"><strong>Ubicación:</strong> {ganado.city}, {ganado.department}</li>
        </ul>

        <button className="btn btn-success w-100 mt-3" onClick={agregarAlCarrito}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
