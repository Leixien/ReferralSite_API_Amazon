"""
Route ricerca prodotti
"""
from flask import Blueprint, render_template, request, jsonify, current_app
from amazon.api_client import AmazonClient
from config import Config
import logging

search_bp = Blueprint('search', __name__)
logger = logging.getLogger(__name__)


def get_amazon_client():
    """Ottieni istanza client Amazon (cached nell'app context)"""
    if not hasattr(current_app, 'amazon_client'):
        current_app.amazon_client = AmazonClient(
            access_key=Config.AWS_ACCESS_KEY,
            secret_key=Config.AWS_SECRET_KEY,
            associate_tag=Config.ASSOCIATE_TAG,
            region=Config.REGION,
            marketplace=Config.MARKETPLACE
        )
    return current_app.amazon_client


@search_bp.route('/search', methods=['GET', 'POST'])
def search():
    """Endpoint ricerca prodotti"""

    # Ottieni parametri (supporta sia GET che POST)
    if request.method == 'POST':
        keywords = request.form.get('keywords', '').strip()
        max_price = request.form.get('max_price', type=float)
        category = request.form.get('category', 'All')
        prime_only = request.form.get('prime_only') == 'on'
        discount_only = request.form.get('discount_only') == 'on'
    else:
        keywords = request.args.get('keywords', '').strip()
        max_price = request.args.get('max_price', type=float)
        category = request.args.get('category', 'All')
        prime_only = request.args.get('prime_only') == 'true'
        discount_only = request.args.get('discount_only') == 'true'

    # Validazione
    if not keywords:
        return render_template(
            'results.html',
            error='Inserisci delle parole chiave per la ricerca',
            products=[],
            search_params={}
        )

    # Parametri ricerca
    search_params = {
        'keywords': keywords,
        'max_price': max_price,
        'category': category,
        'prime_only': prime_only,
        'discount_only': discount_only
    }

    # Esegui ricerca
    try:
        client = get_amazon_client()
        result = client.search_items(
            keywords=keywords,
            max_price=max_price,
            category=category,
            item_count=Config.ITEMS_PER_PAGE,
            prime_only=prime_only,
            discount_only=discount_only
        )

        # Gestisci errore API
        if result['error']:
            return render_template(
                'results.html',
                error=result['error'],
                products=[],
                search_params=search_params
            )

        # Renderizza risultati
        return render_template(
            'results.html',
            products=result['products'],
            count=result['count'],
            search_params=search_params,
            categories=Config.CATEGORIES
        )

    except Exception as e:
        logger.error(f"Errore durante ricerca: {str(e)}")
        return render_template(
            'results.html',
            error=f'Si è verificato un errore: {str(e)}',
            products=[],
            search_params=search_params
        )


@search_bp.route('/api/search', methods=['GET'])
def api_search():
    """API endpoint per ricerca AJAX"""

    keywords = request.args.get('keywords', '').strip()

    if not keywords:
        return jsonify({
            'success': False,
            'error': 'Keywords mancanti'
        }), 400

    try:
        client = get_amazon_client()
        result = client.search_items(
            keywords=keywords,
            max_price=request.args.get('max_price', type=float),
            category=request.args.get('category', 'All'),
            prime_only=request.args.get('prime_only') == 'true',
            discount_only=request.args.get('discount_only') == 'true'
        )

        if result['error']:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500

        return jsonify({
            'success': True,
            'products': result['products'],
            'count': result['count']
        })

    except Exception as e:
        logger.error(f"Errore API search: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
