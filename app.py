"""
Amazon Prime Day Affiliate Finder
Applicazione Flask per ricerca prodotti Amazon con link affiliati
"""
from flask import Flask, render_template
from flask_caching import Cache
from flask_cors import CORS
from config import Config
from routes.main import main_bp
from routes.search import search_bp
import logging
import os

# Setup logging
logging.basicConfig(
    level=logging.DEBUG if Config.DEBUG else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


def create_app():
    """Factory pattern per creare app Flask"""

    app = Flask(__name__)
    app.config.from_object(Config)

    # Verifica credenziali Amazon
    try:
        Config.validate()
    except ValueError as e:
        logger.error(str(e))
        # In dev possiamo continuare, in prod meglio bloccare
        if not Config.DEBUG:
            raise

    # Inizializza estensioni
    cache = Cache(app, config={
        'CACHE_TYPE': Config.CACHE_TYPE,
        'CACHE_DEFAULT_TIMEOUT': Config.CACHE_DEFAULT_TIMEOUT
    })
    CORS(app)

    # Registra blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(search_bp)

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Errore interno: {str(error)}")
        return render_template('500.html'), 500

    # Template filters
    @app.template_filter('format_price')
    def format_price_filter(amount):
        """Formatta prezzo con virgola decimale"""
        if amount is None:
            return 'N/A'
        return f"€ {float(amount):.2f}".replace('.', ',')

    @app.template_filter('stars')
    def stars_filter(rating):
        """Converte rating numerico in stelle HTML"""
        if not rating:
            return ''

        full_stars = int(rating)
        half_star = 1 if (rating - full_stars) >= 0.5 else 0
        empty_stars = 5 - full_stars - half_star

        html = '★' * full_stars
        if half_star:
            html += '½'
        html += '☆' * empty_stars

        return html

    # Context processors
    @app.context_processor
    def inject_globals():
        """Inietta variabili globali nei template"""
        return {
            'app_name': 'Amazon Prime Finder',
            'categories': Config.CATEGORIES,
            'config': {
                'DEMO_MODE': os.getenv('DEMO_MODE', 'False').lower() == 'true',
                'AWS_ACCESS_KEY': Config.AWS_ACCESS_KEY
            }
        }

    logger.info("App Flask inizializzata correttamente")
    return app


# Crea l'app a livello di modulo per gunicorn
app = create_app()


if __name__ == '__main__':
    # Ottieni porta da env o usa 5000
    port = int(os.getenv('PORT', 5000))

    logger.info(f"Avvio server su http://localhost:{port}")
    logger.info("Premi CTRL+C per terminare")

    app.run(
        host='0.0.0.0',
        port=port,
        debug=Config.DEBUG
    )
