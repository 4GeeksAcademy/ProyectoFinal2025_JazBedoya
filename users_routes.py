from flask import request, jsonify
from models import db, User
from flask_jwt_extended import   JWTManager, create_access_token, jwt_required, get_jwt_identity

def register_user_routes(app):

    @app.route("/users", methods= [ "GET" ,"POST"])
    def get_or_add_user():
        if request.method == "GET":
            result = User.query.all()
            result = [u.serialize() for u in result]
            return jsonify({"estado": "ok", "usuarios": result}), 200

        if request.method == "POST":
            datos = request.get_json()

            nuevo = User(
                name=datos["name"],
                email=datos["email"],
                password=datos["password"],
                role=datos.get("role", "vendedor")
            )

            db.session.add(nuevo)
            db.session.commit()

            return jsonify({
                "estado": "ok",
                "mensaje": "Usuario creado correctamente"
            }), 201

    @app.route("/users/<int:id>", methods=["GET", "DELETE"])
    def get_or_delete_user(id):
        user = User.query.get(id)

        if request.method == "GET":
            if not user:
                return jsonify({"estado": "error", "mensaje": "Usuario no encontrado"}), 404
            return jsonify(user.serialize()), 200

        if request.method == "DELETE":
            if not user:
                return jsonify({"estado": "error", "mensaje": "El usuario no existe"}), 404

            db.session.delete(user)
            db.session.commit()

            return jsonify({"estado": "ok", "mensaje": "Usuario eliminado"}), 200

    @app.route("/token", methods=["POST"])
    def create_token():
        datos = request.get_json()
        email = datos.get("email")
        password = datos.get("password")

        user = User.query.filter_by(email=email, password=password).first()

        if not user:
            return jsonify({"estado": "error", "mensaje": "bad user o password"}), 401

        token = create_access_token(identity=str(user.id))

        return jsonify({
            "estado": "ok",
            "token": token,
            "user": user.serialize()
        }), 200

   
    @app.route("/protected", methods=["GET"])
    @jwt_required() #Esto espera un token para ejecutarse
    def protected():
            # Accede a la identidad del usuario actual con get_jwt_identity
            current_user_id = int(get_jwt_identity()) # Con et_jwt_identity desencripta el token
            user = User.query.get(current_user_id) #Nos devuelve el usuario en cuestion, la variable ve si ese usuario existe
            
            return jsonify({"id": user.id, "email": user.email }), 200