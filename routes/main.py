"""
Route principale - Homepage
"""
from flask import Blueprint, render_template
from config import Config

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Homepage con form di ricerca"""
    return render_template(
        'index.html',
        categories=Config.CATEGORIES
    )


@main_bp.route('/about')
def about():
    """Pagina informazioni"""
    return render_template('about.html')
