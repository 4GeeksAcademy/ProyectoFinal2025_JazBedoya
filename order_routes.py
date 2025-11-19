#Ruta para crear ordenes "compras" y ver el historial

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ArticuloDelCarrito, Order, OrderItem

def register_order_routes(app):
    @app.route("/orders/checkout", methods= ["POST"])
    @jwt_required
    def checkout():
        """
        Convierte el carrito actual del usuario en una orden.
        - Calcula el total.
        - Crea la orden.
        - Crea los OrderItem.
        - Vacía el carrito.
        Por ahora marcamos la orden como "paid" pagada de forma simulada.
        """
        user_id = int(get_jwt_identity())
        items = ArticuloDelCarrito.query.filter_by(user_id=user_id).all()

        if not items:
            return jsonify({"msg": "Carrito vacío"}), 400

        total = sum(i.subtotal() for i in items)

        order = Order(user_id=user_id, total_amount=total, status="pending")
        db.session.add(order)
        db.session.flush()  # para obtener order.id sin hacer commit todavía

        for i in items:
            order_item = OrderItem(
                order_id=order.id,
                ganado_id=i.ganado_id,
                quantity=i.quantity,
                price_per_head=i.price_per_head
            )
            db.session.add(order_item)
            db.session.delete(i)  # eliminar del carrito

       
        order.status = "paid"  # simulamos que se pago 

        db.session.commit()

        return jsonify(order.serialize()), 201


    @app.route("/orders", methods=["GET"])
    @jwt_required()
    def mis_ordenes(): #muestra todas las ordenes del usuario logueado
        
        user_id = int(get_jwt_identity())
        orders = Order.query.filter_by(user_id=user_id).all()
        return jsonify([o.serialize() for o in orders]), 200