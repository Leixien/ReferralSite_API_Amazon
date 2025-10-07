/**
 * Amazon Prime Finder - Main JavaScript
 */

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (darkModeToggle) {
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);

        darkModeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});

// Form Validation
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        const keywords = document.getElementById('keywords').value.trim();

        if (!keywords) {
            e.preventDefault();
            alert('Inserisci delle parole chiave per la ricerca');
            return false;
        }

        // Optional: validate max price is positive
        const maxPrice = document.getElementById('max_price').value;
        if (maxPrice && parseFloat(maxPrice) < 0) {
            e.preventDefault();
            alert('Il prezzo massimo deve essere maggiore di zero');
            return false;
        }
    });
}

// Save Search to LocalStorage
function saveSearch(keywords, category, maxPrice) {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    const search = {
        keywords,
        category,
        maxPrice,
        timestamp: new Date().toISOString()
    };

    // Add to beginning, limit to last 10 searches
    searches.unshift(search);
    const limitedSearches = searches.slice(0, 10);

    localStorage.setItem('recentSearches', JSON.stringify(limitedSearches));
}

// Load Recent Searches
function loadRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    return searches;
}

// Export Results to CSV
function exportToCSV(products) {
    if (!products || products.length === 0) {
        alert('Nessun prodotto da esportare');
        return;
    }

    // CSV Headers
    let csv = 'ASIN,Title,Brand,Price,Original Price,Discount %,Prime,Rating,Reviews,URL\n';

    // Add products
    products.forEach(product => {
        const row = [
            product.asin,
            `"${product.title.replace(/"/g, '""')}"`, // Escape quotes
            `"${product.brand}"`,
            product.price.current || 'N/A',
            product.price.original || 'N/A',
            product.price.discount_percent || 0,
            product.is_prime ? 'Yes' : 'No',
            product.rating.stars || 0,
            product.rating.count || 0,
            product.url
        ];
        csv += row.join(',') + '\n';
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `amazon-products-${Date.now()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Copy Link to Clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Link copiato negli appunti!');
        }).catch(err => {
            console.error('Errore copia link:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback per browser che non supportano Clipboard API
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showNotification('Link copiato negli appunti!');
    } catch (err) {
        console.error('Errore copia link:', err);
        alert('Impossibile copiare il link');
    }

    document.body.removeChild(textArea);
}

// Show Toast Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#067D62' : '#CC0C39'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lazy Loading Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Share Search Results
function shareResults() {
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: 'Amazon Prime Finder - Risultati',
            text: 'Guarda i prodotti che ho trovato!',
            url: url
        }).catch(err => console.log('Errore condivisione:', err));
    } else {
        copyToClipboard(url);
    }
}

// Console welcome message
console.log('%c🎯 Amazon Prime Finder', 'font-size: 20px; font-weight: bold; color: #FF9900');
console.log('%cBuilt with Flask & Amazon Product Advertising API', 'color: #232F3E');
