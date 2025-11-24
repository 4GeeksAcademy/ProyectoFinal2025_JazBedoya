import React, {useState} from "react";

const Signup = () => {
    //Estados para los inputs
    // cada uno tiene su funcion para actualizar

     const [name, setName] = useState("");        
     const [email, setEmail] = useState("");      
     const [password, setPassword] = useState(""); 
     const [loading, setLoading] = useState(false);
     //async porque voy a usar fecth
    const signupUser = async (e) =>{
        e.preventDefault();
        setLoading(true);


        try{
            const resp = await fetch("http://127.0.0.1:5000/users",{   //envia la peticion al backend
                method: "POST",
                headers:{"Content-type": "application/json"} ,
                body: JSON.stringify({name,email,password}),
            });

            console.log(resp);
            
            //manejo de errores

            if(!resp.ok){
                if(resp.status === 400 || resp.status ===409)
                     throw new Error ("Datos invalidos o usuario ya existente");

                throw new Error("Error en el registro");
            }

        const data = await resp.json();  //Convierte la respuest el json, redirige al usuario a la pagina login
        alert("Usuario registrado con exito");
        window.location.href = "/login";

           }catch (err){
            alert(err.message);
           }
        };


        return(
        <div className="col-md-5 mx-auto mt-4">

            <div className="card shadow">
                <div className="card-body">

                    <h3 className="text-center">Crear cuenta</h3>
                    <form onSubmit={signupUser}>

                        <div className="mt-3">
                            <label>Nombre</label>
                            <input className="form-control" onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="mt-3">
                            <label>Email</label>
                            <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="mt-3">
                            <label>Contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <button className="btn btn-success w-100 mt-4">Registrarse</button>

                    </form>

                    <p className="text-center mt-3">
                        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
                    </p>
                </div>
            </div>
        </div>
    );
}


















export default Signup;