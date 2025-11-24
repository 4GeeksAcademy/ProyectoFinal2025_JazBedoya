import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt-token");

  const logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
      <div className="container-fluid">

        {/* LOGO */}
        <span
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/catalogo")}
        >
          GanadoPY
        </span>

        {/* BOTÓN HAMBURGUESA MOBILE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* LINKS */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">Catálogo</Link>
            </li>

            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/carrito">Carrito</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/perfil">Mi perfil</Link>
                </li>
              </>
            )}
          </ul>

          {/* DERECHA → LOGIN / LOGOUT */}
          <div className="d-flex">

            {!token && (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">
                  Iniciar sesión
                </Link>

                <Link className="btn btn-warning" to="/signup">
                  Registrarse
                </Link>
              </>
            )}

            {token && (
              <button className="btn btn-outline-light" onClick={logout}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
