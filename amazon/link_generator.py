"""
Generatore link affiliati Amazon
"""
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse


def generate_affiliate_link(asin, associate_tag, marketplace='www.amazon.it'):
    """
    Genera link affiliato Amazon da ASIN

    Args:
        asin: Amazon Standard Identification Number
        associate_tag: Tag affiliato Amazon
        marketplace: Dominio marketplace (default: www.amazon.it)

    Returns:
        str: URL affiliato completo
    """
    if not asin or not associate_tag:
        return ''

    # Costruisci URL base
    base_url = f"https://{marketplace}/dp/{asin}"

    # Aggiungi parametri affiliato
    params = {
        'tag': associate_tag,
        'linkCode': 'll1',
        'creative': '9325',
        'creativeASIN': asin
    }

    # Costruisci URL completo
    query_string = urlencode(params)
    return f"{base_url}?{query_string}"


def add_affiliate_tag_to_url(url, associate_tag):
    """
    Aggiunge o sostituisce tag affiliato in URL Amazon esistente

    Args:
        url: URL Amazon esistente
        associate_tag: Tag affiliato da aggiungere

    Returns:
        str: URL con tag affiliato
    """
    if not url or not associate_tag:
        return url

    # Parse URL
    parsed = urlparse(url)
    params = parse_qs(parsed.query)

    # Aggiungi/sostituisci tag
    params['tag'] = [associate_tag]

    # Ricostruisci URL
    new_query = urlencode(params, doseq=True)
    new_url = urlunparse((
        parsed.scheme,
        parsed.netloc,
        parsed.path,
        parsed.params,
        new_query,
        parsed.fragment
    ))

    return new_url


def extract_asin_from_url(url):
    """
    Estrae ASIN da URL Amazon

    Args:
        url: URL prodotto Amazon

    Returns:
        str: ASIN o None se non trovato
    """
    if not url:
        return None

    # Parse URL
    parsed = urlparse(url)
    path_parts = parsed.path.split('/')

    # ASIN è solitamente dopo /dp/ o /product/
    try:
        if 'dp' in path_parts:
            idx = path_parts.index('dp')
            return path_parts[idx + 1]
        elif 'product' in path_parts:
            idx = path_parts.index('product')
            return path_parts[idx + 1]
    except (IndexError, ValueError):
        pass

    # Prova a estrarre da query params
    params = parse_qs(parsed.query)
    if 'asin' in params:
        return params['asin'][0]

    return None


def is_amazon_url(url):
    """
    Verifica se URL è di Amazon

    Args:
        url: URL da verificare

    Returns:
        bool: True se è URL Amazon
    """
    if not url:
        return False

    parsed = urlparse(url)
    amazon_domains = [
        'amazon.it',
        'amazon.com',
        'amazon.co.uk',
        'amazon.de',
        'amazon.fr',
        'amazon.es',
        'amzn.to',
        'amzn.eu'
    ]

    return any(domain in parsed.netloc for domain in amazon_domains)
