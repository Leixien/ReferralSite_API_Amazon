# 🎯 Amazon Prime Day Affiliate Finder

> Applicazione web Flask per cercare prodotti Amazon tramite Product Advertising API 5.0 e generare automaticamente link affiliati.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## ✨ Features

- 🔍 **Ricerca prodotti** su Amazon con filtri avanzati
- 💰 **Link affiliati automatici** pronti all'uso
- 🏷️ **Prezzi e sconti** con percentuale di risparmio
- ⭐ **Rating e recensioni** per ogni prodotto
- 🎨 **Design responsive** mobile-first
- 🌓 **Dark mode** con toggle
- 📊 **Export risultati** in CSV
- ⚡ **Caching intelligente** (5 minuti) per ottimizzare chiamate API
- 🎯 **Filtri client-side** per prezzo, rating, Prime
- 📦 **Badge Prime** e sconto visuali

---

## 📋 Prerequisiti

- Python 3.10 o superiore
- Account Amazon Associates
- Credenziali Amazon Product Advertising API 5.0

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/amazon-prime-finder.git
cd amazon-prime-finder
```

### 2. Setup Virtual Environment

```bash
# Crea virtual environment
python -m venv venv

# Attiva virtual environment
# Su macOS/Linux:
source venv/bin/activate

# Su Windows:
venv\Scripts\activate
```

### 3. Installa Dipendenze

```bash
pip install -r requirements.txt
```

### 4. Configura Variabili Ambiente

```bash
# Copia file esempio
cp .env.example .env

# Edita .env con le tue credenziali
nano .env  # o usa il tuo editor preferito
```

**File `.env` da configurare:**

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here-change-in-production
FLASK_DEBUG=True

# Amazon Product Advertising API Credentials
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
AMAZON_ASSOCIATE_TAG=your-associate-tag

# Amazon Region/Marketplace
AMAZON_REGION=eu-west-1
AMAZON_MARKETPLACE=www.amazon.it

# Cache Configuration
CACHE_TYPE=simple
CACHE_DEFAULT_TIMEOUT=300
```

### 5. Avvia Applicazione

```bash
python app.py
```

L'applicazione sarà disponibile su: **http://localhost:5000**

---

## 🔑 Come Ottenere Credenziali Amazon

### Passo 1: Iscriviti ad Amazon Associates

1. Vai su [Amazon Associates](https://affiliate-program.amazon.com/)
2. Registra un account (gratuito)
3. Completa il profilo e fornisci informazioni sul tuo sito web
4. Ottieni il tuo **Associate Tag** (es: `tuosito-21`)

⚠️ **IMPORTANTE**: Devi generare almeno **3 vendite qualificate entro 180 giorni** dall'iscrizione, altrimenti l'account verrà chiuso.

### Passo 2: Richiedi Accesso API Product Advertising

1. Accedi ad [Amazon Associates](https://affiliate-program.amazon.com/home)
2. Vai su **Strumenti** → **Product Advertising API**
3. Richiedi accesso all'API
4. Una volta approvato, vai su [AWS IAM](https://console.aws.amazon.com/iam/)
5. Crea un nuovo utente IAM con permessi API Product Advertising
6. Ottieni **Access Key ID** e **Secret Access Key**

### Passo 3: Configura .env

Inserisci le credenziali nel file `.env`:

```env
AWS_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AMAZON_ASSOCIATE_TAG=tuosito-21
```

---

## 📁 Struttura Progetto

```
amazon-prime-finder/
├── app.py                      # Entry point Flask
├── requirements.txt            # Dipendenze Python
├── .env.example               # Template variabili ambiente
├── .gitignore                 # File da ignorare in Git
├── README.md                  # Questa guida
├── config.py                  # Configurazione centralizzata
│
├── amazon/                    # Package Amazon API
│   ├── __init__.py
│   ├── api_client.py         # Wrapper Amazon API
│   ├── product_parser.py     # Parser risposte API
│   └── link_generator.py     # Generator link affiliati
│
├── routes/                    # Routes Flask
│   ├── __init__.py
│   ├── main.py               # Homepage
│   └── search.py             # Ricerca prodotti
│
├── templates/                 # Template HTML
│   ├── base.html             # Template base
│   ├── index.html            # Homepage
│   ├── results.html          # Risultati ricerca
│   ├── 404.html              # Errore 404
│   └── 500.html              # Errore 500
│
├── static/                    # Asset statici
│   ├── css/
│   │   ├── reset.css         # CSS reset
│   │   ├── variables.css     # Design tokens
│   │   └── style.css         # Stili principali
│   ├── js/
│   │   ├── app.js            # Logic principale
│   │   └── filters.js        # Filtri client-side
│   └── images/
│       └── placeholder.png   # Immagine fallback
│
└── tests/                     # Test suite
    ├── __init__.py
    └── test_api.py           # Unit tests
```

---

## 🎨 Utilizzo

### Ricerca Base

1. Inserisci **parole chiave** (es: "laptop gaming")
2. (Opzionale) Seleziona **categoria**
3. (Opzionale) Imposta **prezzo massimo**
4. Click su **Cerca Prodotti**

### Filtri Avanzati

- ✅ **Solo prodotti Prime**: mostra solo prodotti eligibili Prime
- 🔥 **Solo prodotti in sconto**: filtra prodotti con sconto attivo

### Risultati

Ogni card prodotto mostra:

- 📷 Immagine prodotto
- 📝 Titolo e brand
- 💶 Prezzo attuale e originale (se in sconto)
- 🏷️ Badge percentuale sconto
- 🔵 Badge Prime (se eleggibile)
- ⭐ Rating stelle + numero recensioni
- 🔗 **Link affiliato** pronto per Amazon

### Filtri Client-Side (pagina risultati)

- **Ordina per**: Rilevanza, Prezzo (↑/↓), Sconto, Rating
- **Prezzo max**: Filtra per range di prezzo
- **Rating min**: Mostra solo prodotti 3+ o 4+ stelle

---

## 🔧 Configurazione Avanzata

### Modificare Categorie

Edita `config.py` per aggiungere/rimuovere categorie:

```python
CATEGORIES = {
    'All': 'Tutte',
    'Electronics': 'Elettronica',
    'Books': 'Libri',  # Aggiungi nuova categoria
    # ...
}
```

### Cache

Modifica timeout cache in `.env`:

```env
CACHE_DEFAULT_TIMEOUT=300  # 5 minuti (in secondi)
```

### Numero Risultati

Modifica `ITEMS_PER_PAGE` in `config.py`:

```python
ITEMS_PER_PAGE = 10  # Max 10 per API limits
```

---

## 📊 API Limits e Best Practices

### Limiti Amazon Product Advertising API

- **Request rate**: 1 richiesta/secondo (per account)
- **Max items per richiesta**: 10 prodotti
- **Daily quota**: Varia in base al tier dell'account

### Best Practices

1. **Usa il caching**: l'app cachea le ricerche per 5 minuti
2. **Evita ricerche duplicate**: verifica prima di chiamare API
3. **Monitora usage**: controlla i report su Amazon Associates
4. **Gestisci errori**: l'app gestisce rate limiting e timeout
5. **Non abusare**: rispetta i limiti per evitare ban

---

## 🧪 Testing

Esegui i test:

```bash
# Installa pytest (se non già fatto)
pip install pytest

# Esegui tutti i test
pytest

# Test specifico
pytest tests/test_api.py

# Con coverage
pytest --cov=amazon tests/
```

---

## 🐛 Troubleshooting

### Errore "Credenziali Amazon mancanti"

✅ **Soluzione**: Verifica che `.env` contenga tutte le credenziali richieste.

### Errore "InvalidClientTokenId"

✅ **Soluzione**: Access Key o Secret Key non valide. Rigenera da AWS IAM.

### Errore "SignatureDoesNotMatch"

✅ **Soluzione**: Secret Key errata o formato timestamp non valido.

### Errore "TooManyRequests"

✅ **Soluzione**: Hai superato il rate limit (1 req/sec). Attendi qualche secondo.

### Nessun risultato trovato

✅ **Soluzione**:
- Prova keywords più generiche
- Rimuovi filtri troppo restrittivi
- Verifica categoria selezionata

### Immagini non caricate

✅ **Soluzione**: Crea placeholder in `static/images/placeholder.png`

---

## 🚀 Deploy in Produzione

⚠️ **IMPORTANTE**: Netlify **NON** è adatto per questa app (supporta solo siti statici). Usa le alternative qui sotto.

### Opzione 1: Render (CONSIGLIATO - Tier Gratuito)

**Tutti i file necessari sono già inclusi!** (`render.yaml`, `Procfile`, `runtime.txt`)

1. **Push su GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vai su [Render.com](https://render.com)** e registrati

3. **New → Web Service**

4. **Connetti repository GitHub**

5. **Render rileva automaticamente `render.yaml`** ✅

6. **Configura variabili ambiente** (nel dashboard):
   - `AWS_ACCESS_KEY` → la tua access key
   - `AWS_SECRET_KEY` → la tua secret key
   - `AMAZON_ASSOCIATE_TAG` → il tuo tag affiliato

7. **Deploy!** 🚀

**Il tier gratuito include**:
- 750 ore/mese
- Deploy automatici da Git
- HTTPS gratis
- Sleep dopo 15 min inattività (si riattiva automaticamente)

### Opzione 2: Railway

```bash
# 1. Installa Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway init
railway up

# 4. Aggiungi variabili ambiente
railway variables set AWS_ACCESS_KEY=xxx
railway variables set AWS_SECRET_KEY=xxx
railway variables set AMAZON_ASSOCIATE_TAG=xxx
```

**Tier gratuito**: $5 crediti/mese

### Opzione 3: Fly.io

```bash
# 1. Installa flyctl
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Launch app
fly launch

# 4. Set secrets
fly secrets set AWS_ACCESS_KEY=xxx AWS_SECRET_KEY=xxx AMAZON_ASSOCIATE_TAG=xxx

# 5. Deploy
fly deploy
```

**Tier gratuito**: 3 VM piccole

### Opzione 4: PythonAnywhere

1. Registrati su [pythonanywhere.com](https://www.pythonanywhere.com)
2. Crea un nuovo Web App → Flask
3. Upload codice via Git o dashboard
4. Configura variabili ambiente in `.env`
5. Reload app

⚠️ **Limitazione**: Il tier gratuito ha restrizioni su chiamate API esterne

### Opzione 5: VPS Self-Hosted (DigitalOcean, AWS EC2, ecc.)

```bash
# Setup server
sudo apt update
sudo apt install python3-pip nginx

# Clone repo
git clone your-repo
cd amazon-prime-finder

# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Gunicorn
gunicorn -w 4 -b 127.0.0.1:8000 app:app --daemon

# Nginx reverse proxy
sudo nano /etc/nginx/sites-available/amazon-finder
# [configura proxy_pass a localhost:8000]

sudo systemctl restart nginx
```

**IMPORTANTE in produzione:**

- Cambia `SECRET_KEY` con valore random sicuro
- Imposta `FLASK_DEBUG=False`
- Usa HTTPS (certificato SSL)
- Aggiungi rate limiting (Flask-Limiter)
- Monitora logs e errori

---

## 📝 TODO / Roadmap

- [ ] Paginazione risultati (oltre i primi 10)
- [ ] Cronologia ricerche (database)
- [ ] Wishlist prodotti
- [ ] Notifiche sconto via email
- [ ] Comparazione prezzi storici
- [ ] API REST pubblica
- [ ] Dashboard analytics
- [ ] Multi-marketplace (Amazon.com, .de, .fr, ecc.)

---

## 🤝 Contributing

Contribuzioni benvenute! Per favore:

1. Fork il repository
2. Crea un branch (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

---

## 📄 License

Questo progetto è rilasciato sotto licenza **MIT**.

Vedi file [LICENSE](LICENSE) per dettagli.

---

## ⚠️ Disclaimer

Questo tool è fornito "as is" senza garanzie. L'utilizzo dell'API Amazon Product Advertising è soggetto ai [Termini di Servizio Amazon](https://affiliate-program.amazon.com/help/operating/agreement).

- I prezzi potrebbero non essere aggiornati in tempo reale
- Amazon si riserva il diritto di modificare o revocare l'accesso API
- Assicurati di rispettare le [Policy Amazon Associates](https://affiliate-program.amazon.com/help/operating/policies)

---

## 👤 Author

**Il Tuo Nome**

- GitHub: [@your-username](https://github.com/your-username)
- Website: [your-website.com](https://your-website.com)

---

## 🙏 Acknowledgments

- [Amazon Product Advertising API](https://webservices.amazon.com/paapi5/documentation/)
- [Flask](https://flask.palletsprojects.com/)
- [python-amazon-paapi](https://github.com/sergioteula/python-amazon-paapi)

---

**Buona ricerca! 🎯🛒**
