"""
Parser per risposte Amazon Product Advertising API
"""
import logging

logger = logging.getLogger(__name__)


def safe_get(obj, *keys, default=None):
    """
    Accesso sicuro a attributi annidati

    Args:
        obj: Oggetto da cui estrarre dati
        *keys: Sequenza di chiavi/attributi
        default: Valore di default se non trovato

    Returns:
        Valore trovato o default
    """
    try:
        for key in keys:
            if obj is None:
                return default
            obj = getattr(obj, key, None) if hasattr(obj, key) else obj.get(key)
        return obj if obj is not None else default
    except (AttributeError, KeyError, TypeError):
        return default


def parse_product(item, associate_tag):
    """
    Estrae dati strutturati da un item Amazon API

    Args:
        item: Item dalla risposta API Amazon
        associate_tag: Tag affiliato per costruire URL

    Returns:
        dict: {
            'asin': str,
            'title': str,
            'url': str,
            'image_url': str,
            'brand': str,
            'price': {
                'current': float,
                'current_formatted': str,
                'original': float | None,
                'original_formatted': str | None,
                'discount_percent': int | None
            },
            'is_prime': bool,
            'rating': {
                'stars': float,
                'count': int
            },
            'features': list[str]
        }
    """
    try:
        # ASIN
        asin = safe_get(item, 'asin', default='')
        if not asin:
            logger.warning("Prodotto senza ASIN, skipping")
            return None

        # Titolo
        title = safe_get(item, 'item_info', 'title', 'display_value', default='Titolo non disponibile')

        # URL prodotto
        url = safe_get(item, 'detail_page_url', default='')
        if url and associate_tag:
            # Assicura che l'URL contenga il tag affiliato
            if 'tag=' not in url:
                separator = '&' if '?' in url else '?'
                url = f"{url}{separator}tag={associate_tag}"

        # Immagine
        image_url = safe_get(
            item,
            'images',
            'primary',
            'large',
            'url',
            default='/static/images/placeholder.png'
        )

        # Brand
        brand = safe_get(
            item,
            'item_info',
            'by_line_info',
            'brand',
            'display_value',
            default='Sconosciuto'
        )

        # Prezzi
        price_data = {}
        listing = safe_get(item, 'offers', 'listings')
        if listing and len(listing) > 0:
            first_listing = listing[0]

            # Prezzo corrente
            current_price = safe_get(first_listing, 'price', 'amount')
            if current_price:
                price_data['current'] = float(current_price)
                price_data['current_formatted'] = safe_get(
                    first_listing,
                    'price',
                    'display_amount',
                    default=f"€ {current_price}"
                )
            else:
                price_data['current'] = None
                price_data['current_formatted'] = 'Non disponibile'

            # Prezzo originale (se in sconto)
            saving_basis = safe_get(first_listing, 'saving_basis', 'amount')
            if saving_basis:
                price_data['original'] = float(saving_basis)
                price_data['original_formatted'] = safe_get(
                    first_listing,
                    'saving_basis',
                    'display_amount',
                    default=f"€ {saving_basis}"
                )

                # Calcola percentuale sconto
                if current_price and saving_basis:
                    discount = ((float(saving_basis) - float(current_price)) / float(saving_basis)) * 100
                    price_data['discount_percent'] = int(discount)
                else:
                    price_data['discount_percent'] = None
            else:
                price_data['original'] = None
                price_data['original_formatted'] = None
                price_data['discount_percent'] = None

            # Eleggibilità Prime
            is_prime = safe_get(
                first_listing,
                'program_eligibility',
                'is_prime_exclusive',
                default=False
            )
        else:
            # Nessuna offerta disponibile
            price_data = {
                'current': None,
                'current_formatted': 'Non disponibile',
                'original': None,
                'original_formatted': None,
                'discount_percent': None
            }
            is_prime = False

        # Rating recensioni
        rating_value = safe_get(item, 'customer_reviews', 'star_rating', 'value')
        rating_count = safe_get(item, 'customer_reviews', 'count', default=0)

        rating = {
            'stars': float(rating_value) if rating_value else 0.0,
            'count': int(rating_count) if rating_count else 0
        }

        # Features
        features_obj = safe_get(item, 'item_info', 'features', 'display_values')
        features = list(features_obj) if features_obj else []

        # Costruisci oggetto prodotto
        product = {
            'asin': asin,
            'title': title,
            'url': url,
            'image_url': image_url,
            'brand': brand,
            'price': price_data,
            'is_prime': is_prime,
            'rating': rating,
            'features': features[:5]  # Max 5 features per card
        }

        return product

    except Exception as e:
        logger.error(f"Errore nel parsing prodotto: {str(e)}")
        return None


def format_price(amount, currency='€'):
    """
    Formatta prezzo con valuta

    Args:
        amount: Importo numerico
        currency: Simbolo valuta (default: €)

    Returns:
        str: Prezzo formattato (es: "€ 29,99")
    """
    if amount is None:
        return 'N/A'

    # Formatta con 2 decimali e virgola
    formatted = f"{float(amount):.2f}".replace('.', ',')
    return f"{currency} {formatted}"
