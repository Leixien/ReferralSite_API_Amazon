"""
Configurazione centralizzata per Amazon Prime Day Affiliate Finder
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configurazione applicazione Flask"""

    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

    # Amazon API
    AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
    AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
    ASSOCIATE_TAG = os.getenv('AMAZON_ASSOCIATE_TAG')
    REGION = os.getenv('AMAZON_REGION', 'eu-west-1')
    MARKETPLACE = os.getenv('AMAZON_MARKETPLACE', 'www.amazon.it')

    # Cache
    CACHE_TYPE = os.getenv('CACHE_TYPE', 'simple')
    CACHE_DEFAULT_TIMEOUT = int(os.getenv('CACHE_DEFAULT_TIMEOUT', 300))

    # Paginazione
    ITEMS_PER_PAGE = 10

    # Categorie supportate Amazon
    CATEGORIES = {
        'All': 'Tutte',
        'Electronics': 'Elettronica',
        'Computers': 'Computer',
        'VideoGames': 'Videogiochi',
        'OfficeProducts': 'Ufficio',
        'Furniture': 'Mobili',
        'HomeAndKitchen': 'Casa e Cucina',
        'Sports': 'Sport',
        'ToysAndGames': 'Giochi',
    }

    @staticmethod
    def validate():
        """Valida che le credenziali Amazon siano configurate"""
        # Se DEMO_MODE è attivo, salta validazione
        demo_mode = os.getenv('DEMO_MODE', 'False').lower() == 'true'
        if demo_mode:
            return True

        required = ['AWS_ACCESS_KEY', 'AWS_SECRET_KEY', 'ASSOCIATE_TAG']
        missing = [key for key in required if not os.getenv(key)]

        if missing:
            # In dev mode, solo warning
            if os.getenv('FLASK_DEBUG', 'False').lower() == 'true':
                print(f"⚠️  Credenziali Amazon mancanti: {', '.join(missing)}")
                print("⚠️  Modalità DEMO attiva - usando dati mock")
                return True
            else:
                raise ValueError(
                    f"Credenziali Amazon mancanti: {', '.join(missing)}. "
                    "Configura il file .env con le tue credenziali."
                )

        return True
