from flask import Blueprint

api_bp = Blueprint('api', __name__)

@api_bp.route('/schedule')
def get_schedule():
    return "schedule"
