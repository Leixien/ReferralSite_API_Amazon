# Prompt per Claude Code: Amazon Prime Day Affiliate Finder

## 🎯 Obiettivo del Progetto

Crea un'applicazione web Flask completa per cercare prodotti su Amazon tramite Product Advertising API 5.0 e generare automaticamente link affiliati. L'app sarà usata durante il Prime Day per trovare rapidamente le migliori offerte.

---

## 📋 Requisiti Funzionali

### 1. **Homepage con Form di Ricerca**
- Campo testo per keywords (obbligatorio)
- Campo numerico per prezzo massimo (opzionale)
- Select per categoria Amazon (es: Electronics, OfficeProducts, VideoGames, ecc.)
- Checkbox "Solo prodotti Prime"
- Checkbox "Solo prodotti in sconto"
- Button submit con icona ricerca

### 2. **Integrazione Amazon Product Advertising API 5.0**
- Utilizzare la libreria `python-amazon-paapi` (più affidabile)
- Autenticazione AWS4 con Access Key, Secret Key, Associate Tag
- Endpoint: SearchItems
- Resources da richiedere:
  - Images.Primary.Large
  - ItemInfo.Title
  - ItemInfo.Features
  - ItemInfo.ByLineInfo (brand)
  - Offers.Listings.Price
  - Offers.Listings.SavingBasis (prezzo originale)
  - Offers.Listings.ProgramEligibility.IsPrimeExclusive
  - CustomerReviews.StarRating
  - CustomerReviews.Count

### 3. **Pagina Risultati**
- Grid responsiva di card prodotti (CSS Grid o Flexbox)
- Ogni card deve mostrare:
  - Immagine prodotto (fallback se mancante)
  - Titolo prodotto (max 2 righe con ellipsis)
  - Brand/Marca
  - Prezzo corrente in grande
  - Prezzo originale barrato (se in sconto)
  - Badge percentuale sconto (se presente)
  - Badge Prime (se eleggibile)
  - Rating stelle + numero recensioni
  - Button "Vedi su Amazon" con link affiliato
- Ordinamento risultati per:
  - Rilevanza (default)
  - Prezzo crescente/decrescente
  - Sconto percentuale
  - Rating
- Filtri laterali per:
  - Range prezzo (slider)
  - Solo Prime
  - Rating minimo
  - Percentuale sconto minima

### 4. **Funzionalità Aggiuntive**
- Salva ricerca (localStorage o database)
- Esporta risultati in CSV/JSON
- Condividi link della ricerca
- Dark mode toggle
- Caching delle ricerche (5 minuti) per non sprecare chiamate API
- Loading spinner durante ricerca
- Gestione errori user-friendly

---

## 🛠 Stack Tecnologico

### Backend
- **Python 3.10+**
- **Flask 3.0** - framework web
- **python-amazon-paapi 5.1.1** - client API Amazon
- **python-dotenv** - gestione variabili ambiente
- **Flask-Caching** - cache risultati
- **Flask-CORS** - se servirà frontend separato

### Frontend
- **HTML5 + CSS3 moderno** (CSS Grid, Flexbox, Custom Properties)
- **JavaScript Vanilla** (no framework, mantieni semplice)
- **Design responsive** mobile-first
- **Font**: Inter o system fonts
- **Icone**: Lucide Icons via CDN o emoji

---

## 📁 Struttura Progetto

```
amazon-prime-finder/
├── app.py                      # Entry point Flask
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
├── config.py                   # Config centralizzata
│
├── amazon/
│   ├── __init__.py
│   ├── api_client.py          # Wrapper Amazon API
│   ├── product_parser.py      # Parse risposte API
│   └── link_generator.py      # Genera link affiliati
│
├── routes/
│   ├── __init__.py
│   ├── main.py                # Route homepage
│   └── search.py              # Route ricerca
│
├── templates/
│   ├── base.html              # Template base con navbar/footer
│   ├── index.html             # Homepage
│   └── results.html           # Risultati ricerca
│
├── static/
│   ├── css/
│   │   ├── reset.css          # CSS reset
│   │   ├── variables.css      # CSS custom properties
│   │   └── style.css          # Stili principali
│   ├── js/
│   │   ├── app.js             # Logic principale
│   │   └── filters.js         # Filtri risultati
│   └── images/
│       └── placeholder.png    # Immagine fallback
│
└── tests/
    ├── __init__.py
    └── test_api.py
```

---

## 🔧 Implementazione Dettagliata

### config.py
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
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
    
    # Categorie supportate
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
```

### amazon/api_client.py
```python
from amazon.paapi import AmazonAPI

class AmazonClient:
    def __init__(self, access_key, secret_key, associate_tag, region, marketplace):
        self.api = AmazonAPI(
            access_key, 
            secret_key, 
            associate_tag, 
            region, 
            marketplace
        )
    
    def search_items(self, keywords, max_price=None, category='All', 
                     item_count=10, prime_only=False, discount_only=False):
        """
        Cerca prodotti su Amazon
        
        Returns:
            dict: {
                'products': [...],
                'count': int,
                'error': str | None
            }
        """
        # Implementa logica ricerca con filtri
        pass
    
    def get_item_details(self, asin):
        """Ottieni dettagli prodotto singolo"""
        pass
```

### amazon/product_parser.py
```python
def parse_product(item):
    """
    Estrae dati strutturati da un item Amazon API
    
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
    # Implementa parsing robusto con gestione errori
    pass
```

---

## 🎨 Design Requirements

### Color Palette (Ispirata Amazon)
```css
:root {
  /* Primary Colors */
  --amazon-orange: #FF9900;
  --amazon-dark: #232F3E;
  --amazon-light: #37475A;
  
  /* Status Colors */
  --price-red: #B12704;
  --prime-blue: #00A8E1;
  --discount-red: #CC0C39;
  --success-green: #067D62;
  
  /* Neutrals */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F3F3F3;
  --text-primary: #0F1111;
  --text-secondary: #565959;
  --border-color: #D5D9D9;
  
  /* Dark Mode */
  --dark-bg: #131A22;
  --dark-card: #232F3E;
  --dark-text: #FFFFFF;
}
```

### UI Components
- **Card prodotto**: shadow on hover, transizioni smooth
- **Buttons**: Amazon style (orange primario, outline secondari)
- **Form inputs**: Border focus con colore primario
- **Loading state**: Skeleton screens o spinner
- **Empty state**: Illustrazione friendly
- **Error state**: Messaggio chiaro + CTA

### Responsive Breakpoints
```css
/* Mobile first */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

---

## ⚠️ Gestione Errori

### Errori API da gestire:
1. **Credenziali invalide** → messaggio chiaro
2. **Rate limit exceeded** → messaggio + suggerimento cache
3. **Nessun risultato** → suggerimenti ricerca alternativa
4. **Timeout** → retry automatico (max 3)
5. **Prodotto non disponibile** → nascondere card
6. **Immagine mancante** → placeholder

### Logging
- Usa `logging` module Python
- Log level: DEBUG in dev, INFO in prod
- Log errori API in file separato

---

## 🧪 Testing

### Unit Tests (pytest)
```python
# tests/test_api.py
def test_search_items_success():
    """Test ricerca con parametri validi"""
    pass

def test_search_items_with_filters():
    """Test filtri prezzo/categoria"""
    pass

def test_parse_product_complete():
    """Test parsing prodotto con tutti i campi"""
    pass

def test_parse_product_missing_fields():
    """Test parsing con campi mancanti"""
    pass

def test_generate_affiliate_link():
    """Test generazione link con associate tag"""
    pass
```

---

## 📝 README.md

Crea un README completo con:
1. **Banner/Logo** del progetto
2. **Descrizione** chiara
3. **Features** list
4. **Screenshots** (placeholder)
5. **Setup instructions** passo-passo:
   - Prerequisiti
   - Clone repo
   - Virtual environment
   - Installazione dipendenze
   - Configurazione .env
   - Run app
6. **Come ottenere credenziali Amazon**
7. **API Limits** e best practices
8. **Troubleshooting** comuni
9. **Contributing** guidelines
10. **License** (MIT)

---

## 🚀 Quick Start Commands

Dopo generazione, README deve includere:

```bash
# Clone
git clone <repo-url>
cd amazon-prime-finder

# Setup
python -m venv venv
source venv/bin/activate  # su Windows: venv\Scripts\activate
pip install -r requirements.txt

# Config
cp .env.example .env
# Edita .env con tue credenziali

# Run
python app.py
# Apri: http://localhost:5000
```

---

## 🎯 Priorità Implementazione

### FASE 1 - MVP (Minimo Viable Product)
1. ✅ Setup progetto + struttura
2. ✅ Integrazione API base (ricerca keywords)
3. ✅ UI minimale (form + risultati)
4. ✅ Link affiliati funzionanti

### FASE 2 - Enhanced
5. ✅ Filtri avanzati (prezzo, Prime, rating)
6. ✅ Design responsive completo
7. ✅ Gestione errori robusta
8. ✅ Caching

### FASE 3 - Advanced
9. ✅ Dark mode
10. ✅ Salvataggio ricerche
11. ✅ Export risultati
12. ✅ Testing

---

## 💡 Best Practices da Seguire

1. **Code Quality**
   - PEP 8 compliant
   - Type hints dove possibile
   - Docstrings per funzioni pubbliche
   - DRY principle

2. **Security**
   - Mai committare .env
   - Sanitize input utente
   - HTTPS in produzione
   - Rate limiting

3. **Performance**
   - Cache risultati API
   - Lazy loading immagini
   - Minify CSS/JS in prod
   - Compression response

4. **UX**
   - Loading states chiari
   - Error messages user-friendly
   - Responsive su mobile
   - Accessibilità (ARIA labels)

---

## 📌 Note Finali

- **Target**: Pronto per Prime Day (domani!)
- **Focus**: Semplicità + affidabilità
- **Mantieni**: Codice pulito, commentato, manutenibile
- **Ricorda**: 3 vendite necessarie per accesso API (includi nota nel README)

Buon lavoro! 🚀