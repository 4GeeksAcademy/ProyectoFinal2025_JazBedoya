from flask import Flask
from models import db
from users_routes import register_user_routes
from ganado_routes import register_ganado_routes
from carrito_routes import register_carrito_routes
from order_routes import register_order_routes
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Base de datos en el mismo directorio
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["JWT_SECRET_KEY"] = "4geeks"

db.init_app(app)
jwt = JWTManager(app)

# Registrar rutas
register_user_routes(app)
register_ganado_routes(app)
register_carrito_routes(app)
register_order_routes(app)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=5000, debug=True)
