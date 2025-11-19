from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify

from models import db, Ganado

def register_ganado_routes(app): #Registra todas las rutas relacionada con ganado

    @app.route("/ganado", methods= ["GET"])
    def listar_ganado():   #devuleve todos los lotes de ganado

        ganado = Ganado.query.filter_by(is_active=True).all()
        #return ("Estas en ganado")
        return jsonify([g.serialize() for g in ganado]), 200
    
    
   
    @app.route("/ganado/<int:id>", methods= ["GET"])
    def obtener_ganado(id): #Devuleve un lote especifico por id

        g = Ganado.query.get(id)
        if not g or not g.is_active:
            return jsonify ({"msg": "Ganado no encontrado"})
        
        return jsonify (g.serialize()),200
    

    
    @app.route("/ganado", methods= ["POST"])
    @jwt_required()
    def crear_ganado(): #crea un nuevo lote de gaando, requiere token el vendendor debe estar logueado

        data = request.get_json()
        vendedor_id = int(get_jwt_identity())

        nuevo = Ganado(
            title=data["title"],
            description=data.get("description"),
            price_per_head=data["price_per_head"],
            breed=data.get("breed"),
            category=data.get("category"),
            age=data.get("age"),
            kg=data.get("kg"),
            department=data.get("department"),
            city=data.get("city"),
            image=data.get("image"),
            vendedor_id=vendedor_id
        )

        db.session.add(nuevo)
        db.session.commit()
        return jsonify(nuevo.serialize()), 201
    


    @app.route("/ganado/<int:id>", methods=["PUT"])
    @jwt_required()
    def editar_ganado(id): #Edita un lote de ganado existente,solo el vendedor dueño del lote puede editarlo
        
    
        
        data = request.get_json()
        g = Ganado.query.get(id)

        if not g:
            return jsonify({"msg": "Ganado no existe"}), 404

        #verificar que el vendedor sea el dueño del lote
        if g.vendedor_id != int(get_jwt_identity()):
            return jsonify({"msg": "No autorizado"}), 403

        #actualizar sólo los campos enviados
        for campo, valor in data.items():
            if hasattr(g, campo):
                setattr(g, campo, valor)

        db.session.commit()
        return jsonify(g.serialize()), 200


    @app.route("/ganado/<int:id>", methods=["DELETE"])
    @jwt_required()
    def eliminar_ganado(id): #Elimina lógicamente un lote de ganado (is_active = False), solo el dueño puede eliminarlo
        
        g = Ganado.query.get(id)

        if not g:
            return jsonify({"msg": "Ganado no existe"}), 404

        if g.vendedor_id != int(get_jwt_identity()):
            return jsonify({"msg": "No autorizado"}), 403

        g.is_active = False
        db.session.commit()
        return jsonify({"msg": "Ganado eliminado"}), 200
        
        