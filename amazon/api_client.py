"""
Client per Amazon Product Advertising API 5.0
"""
from amazon_paapi import AmazonApi
from amazon.product_parser import parse_product
import logging
import os

logger = logging.getLogger(__name__)


class AmazonClient:
    """Wrapper per Amazon Product Advertising API"""

    def __init__(self, access_key, secret_key, associate_tag, region, marketplace):
        """
        Inizializza client Amazon API

        Args:
            access_key: AWS Access Key
            secret_key: AWS Secret Key
            associate_tag: Amazon Associate Tag
            region: AWS Region (es: eu-west-1)
            marketplace: Amazon Marketplace (es: www.amazon.it)
        """
        self.associate_tag = associate_tag
        self.demo_mode = os.getenv('DEMO_MODE', 'False').lower() == 'true'

        # Se credenziali vuote, attiva demo mode
        if not access_key or not secret_key:
            self.demo_mode = True
            logger.warning("⚠️  Credenziali Amazon mancanti - DEMO MODE attiva con dati mock")
            self.api = None
        else:
            self.api = AmazonApi(
                access_key,
                secret_key,
                associate_tag,
                region,
                marketplace
            )
            logger.info("✅ Client Amazon API inizializzato")

    def search_items(
        self,
        keywords,
        max_price=None,
        category='All',
        item_count=10,
        prime_only=False,
        discount_only=False
    ):
        """
        Cerca prodotti su Amazon

        Args:
            keywords: Parole chiave di ricerca
            max_price: Prezzo massimo (opzionale)
            category: Categoria Amazon (default: All)
            item_count: Numero massimo di risultati (max 10)
            prime_only: Solo prodotti Prime
            discount_only: Solo prodotti in sconto

        Returns:
            dict: {
                'products': [...],
                'count': int,
                'error': str | None
            }
        """
        # DEMO MODE - Ritorna dati mock
        if self.demo_mode:
            return self._get_mock_products(keywords, max_price, prime_only, discount_only, item_count)

        try:
            # Parametri di ricerca
            search_params = {
                'keywords': keywords,
                'search_index': category if category != 'All' else 'All',
                'item_count': min(item_count, 10),  # Max 10 per API limit
                'resources': [
                    'Images.Primary.Large',
                    'ItemInfo.Title',
                    'ItemInfo.Features',
                    'ItemInfo.ByLineInfo',
                    'Offers.Listings.Price',
                    'Offers.Listings.SavingBasis',
                    'Offers.Listings.ProgramEligibility.IsPrimeExclusive',
                    'CustomerReviews.StarRating',
                    'CustomerReviews.Count',
                ],
            }

            # Aggiungi filtro prezzo
            if max_price:
                search_params['max_price'] = int(max_price * 100)  # Converti in centesimi

            # Esegui ricerca
            response = self.api.search_items(**search_params)

            # Parse risultati
            if not response or not hasattr(response, 'search_result'):
                return {
                    'products': [],
                    'count': 0,
                    'error': 'Nessun risultato trovato'
                }

            products = []
            for item in response.search_result.items:
                product = parse_product(item, self.associate_tag)

                if product:
                    # Applica filtri custom
                    if prime_only and not product.get('is_prime', False):
                        continue

                    if discount_only and not product.get('price', {}).get('discount_percent'):
                        continue

                    products.append(product)

            return {
                'products': products,
                'count': len(products),
                'error': None
            }

        except Exception as e:
            logger.error(f"Errore nella ricerca Amazon: {str(e)}")
            return {
                'products': [],
                'count': 0,
                'error': f"Errore API: {str(e)}"
            }

    def _get_mock_products(self, keywords, max_price=None, prime_only=False, discount_only=False, item_count=10):
        """Ritorna prodotti mock per demo mode"""
        mock_products = [
            {
                'asin': 'B08N5WRWNW',
                'title': f'Apple AirPods Pro (2nd Gen) - Risultato per "{keywords}"',
                'url': f'https://www.amazon.it/dp/B08N5WRWNW?tag={self.associate_tag}',
                'image_url': 'https://m.media-amazon.com/images/I/61f1YfTkTDL._AC_SL1500_.jpg',
                'brand': 'Apple',
                'price': {
                    'current': 279.0,
                    'current_formatted': '€ 279,00',
                    'original': 329.0,
                    'original_formatted': '€ 329,00',
                    'discount_percent': 15
                },
                'is_prime': True,
                'rating': {
                    'stars': 4.6,
                    'count': 23456
                },
                'features': [
                    'Cancellazione attiva del rumore fino a 2 volte superiore',
                    'Audio spaziale personalizzato',
                    'Modalità Trasparenza adattiva',
                    'Fino a 6 ore di ascolto con ANC attivo'
                ]
            },
            {
                'asin': 'B0BSHF7WHW',
                'title': f'Logitech MX Master 3S - Mouse Wireless - "{keywords}"',
                'url': f'https://www.amazon.it/dp/B0BSHF7WHW?tag={self.associate_tag}',
                'image_url': 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg',
                'brand': 'Logitech',
                'price': {
                    'current': 89.99,
                    'current_formatted': '€ 89,99',
                    'original': 119.99,
                    'original_formatted': '€ 119,99',
                    'discount_percent': 25
                },
                'is_prime': True,
                'rating': {
                    'stars': 4.7,
                    'count': 12890
                },
                'features': [
                    'Sensore da 8K DPI',
                    'Ricarica rapida USB-C',
                    'Connessione Multi-device',
                    'Scorrimento silenzioso'
                ]
            },
            {
                'asin': 'B09X6GQ8X4',
                'title': f'Samsung Galaxy Buds2 Pro - "{keywords}"',
                'url': f'https://www.amazon.it/dp/B09X6GQ8X4?tag={self.associate_tag}',
                'image_url': 'https://m.media-amazon.com/images/I/51DT7r3JnIL._AC_SL1500_.jpg',
                'brand': 'Samsung',
                'price': {
                    'current': 149.0,
                    'current_formatted': '€ 149,00',
                    'original': None,
                    'original_formatted': None,
                    'discount_percent': None
                },
                'is_prime': True,
                'rating': {
                    'stars': 4.4,
                    'count': 8934
                },
                'features': [
                    'Hi-Fi 24bit',
                    'Cancellazione rumore intelligente',
                    'Resistente all\'acqua IPX7',
                    'Batteria fino a 8 ore'
                ]
            },
            {
                'asin': 'B0C1J96NT1',
                'title': f'Anker PowerBank 20000mAh - Power Bank per "{keywords}"',
                'url': f'https://www.amazon.it/dp/B0C1J96NT1?tag={self.associate_tag}',
                'image_url': 'https://m.media-amazon.com/images/I/61N1ZqC+vsL._AC_SL1500_.jpg',
                'brand': 'Anker',
                'price': {
                    'current': 39.99,
                    'current_formatted': '€ 39,99',
                    'original': 59.99,
                    'original_formatted': '€ 59,99',
                    'discount_percent': 33
                },
                'is_prime': True,
                'rating': {
                    'stars': 4.5,
                    'count': 15678
                },
                'features': [
                    'Capacità 20000mAh',
                    'Ricarica rapida 20W',
                    'USB-C bidirezionale',
                    '2 porte di uscita'
                ]
            },
            {
                'asin': 'B0BDJ7R4PG',
                'title': f'Kindle Paperwhite (16 GB) - "{keywords}"',
                'url': f'https://www.amazon.it/dp/B0BDJ7R4PG?tag={self.associate_tag}',
                'image_url': 'https://m.media-amazon.com/images/I/51QCk82iGcL._AC_SL1000_.jpg',
                'brand': 'Amazon',
                'price': {
                    'current': 119.99,
                    'current_formatted': '€ 119,99',
                    'original': 159.99,
                    'original_formatted': '€ 159,99',
                    'discount_percent': 25
                },
                'is_prime': False,
                'rating': {
                    'stars': 4.8,
                    'count': 34521
                },
                'features': [
                    'Display 6.8" ad alta risoluzione',
                    'Regolazione automatica luce',
                    'Impermeabile IPX8',
                    'Batteria settimane di durata'
                ]
            }
        ]

        # Applica filtri
        filtered = []
        for product in mock_products:
            # Filtro prezzo
            if max_price and product['price']['current'] and product['price']['current'] > max_price:
                continue

            # Filtro Prime
            if prime_only and not product['is_prime']:
                continue

            # Filtro sconto
            if discount_only and not product['price']['discount_percent']:
                continue

            filtered.append(product)

        return {
            'products': filtered[:item_count],
            'count': len(filtered[:item_count]),
            'error': None
        }

    def get_item_details(self, asin):
        """
        Ottieni dettagli di un singolo prodotto

        Args:
            asin: Amazon Standard Identification Number

        Returns:
            dict: Dettagli prodotto o None
        """
        if self.demo_mode:
            return None

        try:
            response = self.api.get_items(
                item_ids=[asin],
                resources=[
                    'Images.Primary.Large',
                    'ItemInfo.Title',
                    'ItemInfo.Features',
                    'ItemInfo.ByLineInfo',
                    'Offers.Listings.Price',
                    'Offers.Listings.SavingBasis',
                    'Offers.Listings.ProgramEligibility.IsPrimeExclusive',
                    'CustomerReviews.StarRating',
                    'CustomerReviews.Count',
                ]
            )

            if response and hasattr(response, 'items_result') and response.items_result.items:
                return parse_product(response.items_result.items[0], self.associate_tag)

            return None

        except Exception as e:
            logger.error(f"Errore nel recupero dettagli prodotto {asin}: {str(e)}")
            return None
