import React from "react";
import { Link,useNavigate } from "react-router-dom";

const Navbar = () =>{
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt-token");

    const logout = () => {
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("user");
        navigate("/login")
    
    };
    

    return(
       <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/catalogo")}>
        <span className="logo"> GanadoPY</span>
      </div>

      <div className="navbar-links">
        <Link to="/catalogo">Catálogo</Link>
        {token && <Link to="/carrito">Carrito</Link>}
        {token && <Link to="/perfil">Mi perfil</Link>}
      </div>

      <div className="navbar-right">
        {!token && (
          <>
            <Link className="btn-outline" to="/login">
              Iniciar sesión
            </Link>
            <Link className="btn-primary" to="/signup">
              Registrarse
            </Link>
          </>
        )}
        {token && (
          <button className="btn-outline" onClick={handleLogout}>
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
