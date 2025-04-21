from flask import Flask
from app.api import api_bp

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix='/api')

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
