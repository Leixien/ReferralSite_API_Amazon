"""
Unit Tests per Amazon Prime Finder
"""
import pytest
from unittest.mock import Mock, patch
from amazon.api_client import AmazonClient
from amazon.product_parser import parse_product, safe_get, format_price
from amazon.link_generator import (
    generate_affiliate_link,
    add_affiliate_tag_to_url,
    extract_asin_from_url,
    is_amazon_url
)


# ===== Test Product Parser =====

class TestProductParser:
    """Test per product_parser.py"""

    def test_safe_get_success(self):
        """Test accesso sicuro a attributi annidati"""
        obj = Mock()
        obj.nested = Mock()
        obj.nested.value = "test"

        result = safe_get(obj, 'nested', 'value')
        assert result == "test"

    def test_safe_get_missing_attribute(self):
        """Test accesso a attributo mancante"""
        obj = Mock()
        obj.nested = None

        result = safe_get(obj, 'nested', 'value', default='default')
        assert result == 'default'

    def test_safe_get_none_object(self):
        """Test accesso su oggetto None"""
        result = safe_get(None, 'test', default='default')
        assert result == 'default'

    def test_format_price_valid(self):
        """Test formattazione prezzo valido"""
        result = format_price(29.99)
        assert result == "€ 29,99"

    def test_format_price_none(self):
        """Test formattazione prezzo None"""
        result = format_price(None)
        assert result == "N/A"

    def test_parse_product_complete(self):
        """Test parsing prodotto completo"""
        # Mock item from Amazon API
        item = Mock()
        item.asin = "B08N5WRWNW"

        # Title
        item.item_info = Mock()
        item.item_info.title = Mock()
        item.item_info.title.display_value = "Apple AirPods Pro"

        # Brand
        item.item_info.by_line_info = Mock()
        item.item_info.by_line_info.brand = Mock()
        item.item_info.by_line_info.brand.display_value = "Apple"

        # Image
        item.images = Mock()
        item.images.primary = Mock()
        item.images.primary.large = Mock()
        item.images.primary.large.url = "https://example.com/image.jpg"

        # Price
        listing = Mock()
        listing.price = Mock()
        listing.price.amount = 279.0
        listing.price.display_amount = "€ 279,00"

        # Saving
        listing.saving_basis = Mock()
        listing.saving_basis.amount = 329.0
        listing.saving_basis.display_amount = "€ 329,00"

        # Prime
        listing.program_eligibility = Mock()
        listing.program_eligibility.is_prime_exclusive = True

        item.offers = Mock()
        item.offers.listings = [listing]

        # Reviews
        item.customer_reviews = Mock()
        item.customer_reviews.star_rating = Mock()
        item.customer_reviews.star_rating.value = 4.5
        item.customer_reviews.count = 1234

        # Features
        item.item_info.features = Mock()
        item.item_info.features.display_values = ["Feature 1", "Feature 2"]

        # URL
        item.detail_page_url = "https://www.amazon.it/dp/B08N5WRWNW"

        # Parse
        product = parse_product(item, "test-tag-21")

        # Assertions
        assert product is not None
        assert product['asin'] == "B08N5WRWNW"
        assert product['title'] == "Apple AirPods Pro"
        assert product['brand'] == "Apple"
        assert product['price']['current'] == 279.0
        assert product['price']['original'] == 329.0
        assert product['price']['discount_percent'] == 15
        assert product['is_prime'] is True
        assert product['rating']['stars'] == 4.5
        assert product['rating']['count'] == 1234
        assert len(product['features']) == 2

    def test_parse_product_missing_asin(self):
        """Test parsing prodotto senza ASIN (dovrebbe ritornare None)"""
        item = Mock()
        item.asin = None

        product = parse_product(item, "test-tag-21")
        assert product is None

    def test_parse_product_no_offers(self):
        """Test parsing prodotto senza offerte"""
        item = Mock()
        item.asin = "B08N5WRWNW"
        item.item_info = Mock()
        item.item_info.title = Mock()
        item.item_info.title.display_value = "Test Product"
        item.item_info.by_line_info = Mock()
        item.item_info.by_line_info.brand = Mock()
        item.item_info.by_line_info.brand.display_value = "Test"
        item.images = Mock()
        item.images.primary = Mock()
        item.images.primary.large = Mock()
        item.images.primary.large.url = "https://example.com/image.jpg"
        item.offers = Mock()
        item.offers.listings = []
        item.customer_reviews = Mock()
        item.customer_reviews.star_rating = None
        item.customer_reviews.count = 0
        item.item_info.features = None
        item.detail_page_url = "https://www.amazon.it/dp/B08N5WRWNW"

        product = parse_product(item, "test-tag-21")

        assert product is not None
        assert product['price']['current'] is None
        assert product['price']['current_formatted'] == 'Non disponibile'


# ===== Test Link Generator =====

class TestLinkGenerator:
    """Test per link_generator.py"""

    def test_generate_affiliate_link(self):
        """Test generazione link affiliato"""
        asin = "B08N5WRWNW"
        tag = "test-tag-21"

        link = generate_affiliate_link(asin, tag)

        assert "amazon.it" in link
        assert asin in link
        assert f"tag={tag}" in link

    def test_generate_affiliate_link_empty_asin(self):
        """Test generazione link con ASIN vuoto"""
        link = generate_affiliate_link("", "test-tag-21")
        assert link == ""

    def test_generate_affiliate_link_empty_tag(self):
        """Test generazione link con tag vuoto"""
        link = generate_affiliate_link("B08N5WRWNW", "")
        assert link == ""

    def test_add_affiliate_tag_to_url(self):
        """Test aggiunta tag a URL esistente"""
        url = "https://www.amazon.it/dp/B08N5WRWNW"
        tag = "test-tag-21"

        new_url = add_affiliate_tag_to_url(url, tag)

        assert f"tag={tag}" in new_url
        assert "amazon.it" in new_url

    def test_extract_asin_from_url_dp(self):
        """Test estrazione ASIN da URL /dp/"""
        url = "https://www.amazon.it/dp/B08N5WRWNW?tag=test"
        asin = extract_asin_from_url(url)

        assert asin == "B08N5WRWNW"

    def test_extract_asin_from_url_product(self):
        """Test estrazione ASIN da URL /product/"""
        url = "https://www.amazon.it/product/B08N5WRWNW"
        asin = extract_asin_from_url(url)

        assert asin == "B08N5WRWNW"

    def test_extract_asin_from_url_invalid(self):
        """Test estrazione ASIN da URL invalido"""
        url = "https://www.amazon.it/"
        asin = extract_asin_from_url(url)

        assert asin is None

    def test_is_amazon_url_valid(self):
        """Test verifica URL Amazon valido"""
        assert is_amazon_url("https://www.amazon.it/dp/B08N5WRWNW") is True
        assert is_amazon_url("https://www.amazon.com/dp/B08N5WRWNW") is True
        assert is_amazon_url("https://amzn.to/abc123") is True

    def test_is_amazon_url_invalid(self):
        """Test verifica URL non Amazon"""
        assert is_amazon_url("https://www.google.com") is False
        assert is_amazon_url("") is False
        assert is_amazon_url(None) is False


# ===== Test API Client =====

class TestAmazonClient:
    """Test per api_client.py"""

    @patch('amazon_paapi.AmazonApi')
    def test_search_items_success(self, mock_api_class):
        """Test ricerca prodotti con successo"""
        # Mock API response
        mock_api = Mock()
        mock_api_class.return_value = mock_api

        # Mock search result
        mock_item = Mock()
        mock_item.asin = "B08N5WRWNW"
        mock_item.item_info = Mock()
        mock_item.item_info.title = Mock()
        mock_item.item_info.title.display_value = "Test Product"
        mock_item.item_info.by_line_info = Mock()
        mock_item.item_info.by_line_info.brand = Mock()
        mock_item.item_info.by_line_info.brand.display_value = "Test"
        mock_item.images = Mock()
        mock_item.images.primary = Mock()
        mock_item.images.primary.large = Mock()
        mock_item.images.primary.large.url = "https://example.com/image.jpg"
        mock_item.offers = Mock()
        mock_item.offers.listings = []
        mock_item.customer_reviews = Mock()
        mock_item.customer_reviews.star_rating = None
        mock_item.customer_reviews.count = 0
        mock_item.item_info.features = None
        mock_item.detail_page_url = "https://www.amazon.it/dp/B08N5WRWNW"

        mock_response = Mock()
        mock_response.search_result = Mock()
        mock_response.search_result.items = [mock_item]

        mock_api.search_items.return_value = mock_response

        # Test
        client = AmazonClient("key", "secret", "tag", "region", "marketplace")
        result = client.search_items("laptop")

        assert result['count'] == 1
        assert len(result['products']) == 1
        assert result['error'] is None

    @patch('amazon_paapi.AmazonApi')
    def test_search_items_no_results(self, mock_api_class):
        """Test ricerca senza risultati"""
        mock_api = Mock()
        mock_api_class.return_value = mock_api
        mock_api.search_items.return_value = None

        client = AmazonClient("key", "secret", "tag", "region", "marketplace")
        result = client.search_items("nonexistent")

        assert result['count'] == 0
        assert len(result['products']) == 0
        assert result['error'] is not None

    @patch('amazon_paapi.AmazonApi')
    def test_search_items_with_filters(self, mock_api_class):
        """Test ricerca con filtri"""
        mock_api = Mock()
        mock_api_class.return_value = mock_api

        # Mock Prime product
        mock_item = Mock()
        mock_item.asin = "B08N5WRWNW"
        mock_item.item_info = Mock()
        mock_item.item_info.title = Mock()
        mock_item.item_info.title.display_value = "Prime Product"
        mock_item.item_info.by_line_info = Mock()
        mock_item.item_info.by_line_info.brand = Mock()
        mock_item.item_info.by_line_info.brand.display_value = "Test"
        mock_item.images = Mock()
        mock_item.images.primary = Mock()
        mock_item.images.primary.large = Mock()
        mock_item.images.primary.large.url = "https://example.com/image.jpg"

        listing = Mock()
        listing.price = Mock()
        listing.price.amount = 100.0
        listing.price.display_amount = "€ 100,00"
        listing.saving_basis = None
        listing.program_eligibility = Mock()
        listing.program_eligibility.is_prime_exclusive = True

        mock_item.offers = Mock()
        mock_item.offers.listings = [listing]
        mock_item.customer_reviews = Mock()
        mock_item.customer_reviews.star_rating = None
        mock_item.customer_reviews.count = 0
        mock_item.item_info.features = None
        mock_item.detail_page_url = "https://www.amazon.it/dp/B08N5WRWNW"

        mock_response = Mock()
        mock_response.search_result = Mock()
        mock_response.search_result.items = [mock_item]

        mock_api.search_items.return_value = mock_response

        client = AmazonClient("key", "secret", "tag", "region", "marketplace")
        result = client.search_items("laptop", prime_only=True)

        assert result['count'] == 1
        assert result['products'][0]['is_prime'] is True


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
