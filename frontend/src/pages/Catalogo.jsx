import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalogo() {
  const [ganado, setGanado] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/ganado")
      .then(resp => resp.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : data.ganado;
        setGanado(lista || []);
      });
  }, []);

  return (
    <div>
      <h2 className="mb-4">Catálogo de Lotes</h2>

      <div className="row">
        {ganado.map(g => (
          <div className="col-md-4 mb-4" key={g.id}>
            <div className="card shadow-sm h-100">
              <img 
                src={g.image || "https://via.placeholder.com/400x250"}
                className="card-img-top"
                style={{height: "200px", objectFit: "cover"}}
              />

              <div className="card-body">
                <h5>{g.title}</h5>
                <p className="text-success fw-bold">{g.price_per_head} Gs/cabeza</p>
                <p className="text-muted small">
                  {g.breed} · {g.category} · {g.department}
                </p>

                <Link className="btn btn-outline-success w-100" to={`/detalle/${g.id}`}>
                  Ver detalle
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
