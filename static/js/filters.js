/**
 * Amazon Prime Finder - Filters & Sorting
 * Client-side filtering and sorting for search results
 */

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.querySelector('.products-grid');

    if (!productsGrid) return; // Not on results page

    // Get all product cards
    let products = Array.from(productsGrid.querySelectorAll('.product-card'));

    // Create filter/sort controls
    createControls();

    // Filter functions
    function filterByPrice(maxPrice) {
        products.forEach(card => {
            const priceElement = card.querySelector('.price-current');
            if (!priceElement) {
                card.style.display = 'none';
                return;
            }

            const priceText = priceElement.textContent.replace(/[€\s,]/g, '').replace(',', '.');
            const price = parseFloat(priceText);

            if (maxPrice && price > maxPrice) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
            }
        });
    }

    function filterByPrime(primeOnly) {
        products.forEach(card => {
            const hasPrimeBadge = card.querySelector('.badge-prime');

            if (primeOnly && !hasPrimeBadge) {
                card.style.display = 'none';
            } else if (card.style.display === 'none') {
                card.style.display = 'block';
            }
        });
    }

    function filterByDiscount(discountOnly) {
        products.forEach(card => {
            const hasDiscountBadge = card.querySelector('.badge-discount');

            if (discountOnly && !hasDiscountBadge) {
                card.style.display = 'none';
            } else if (card.style.display === 'none') {
                card.style.display = 'block';
            }
        });
    }

    function filterByRating(minRating) {
        products.forEach(card => {
            const ratingElement = card.querySelector('.rating-value');
            if (!ratingElement) {
                card.style.display = 'none';
                return;
            }

            const rating = parseFloat(ratingElement.textContent);

            if (minRating && rating < minRating) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
            }
        });
    }

    // Sort functions
    function sortProducts(sortBy) {
        const visibleProducts = products.filter(card => card.style.display !== 'none');

        visibleProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return getPrice(a) - getPrice(b);

                case 'price-desc':
                    return getPrice(b) - getPrice(a);

                case 'discount':
                    return getDiscount(b) - getDiscount(a);

                case 'rating':
                    return getRating(b) - getRating(a);

                default:
                    return 0;
            }
        });

        // Reorder DOM
        visibleProducts.forEach(card => {
            productsGrid.appendChild(card);
        });
    }

    // Helper functions to extract values
    function getPrice(card) {
        const priceElement = card.querySelector('.price-current');
        if (!priceElement) return Infinity;

        const priceText = priceElement.textContent.replace(/[€\s,]/g, '').replace(',', '.');
        return parseFloat(priceText) || Infinity;
    }

    function getDiscount(card) {
        const discountBadge = card.querySelector('.badge-discount');
        if (!discountBadge) return 0;

        const discountText = discountBadge.textContent.replace(/[-%]/g, '');
        return parseInt(discountText) || 0;
    }

    function getRating(card) {
        const ratingElement = card.querySelector('.rating-value');
        if (!ratingElement) return 0;

        return parseFloat(ratingElement.textContent) || 0;
    }

    // Create filter/sort UI controls
    function createControls() {
        const resultsInfo = document.querySelector('.results-info');
        if (!resultsInfo) return;

        const controlsHTML = `
            <div class="results-controls" style="
                background-color: var(--bg-primary);
                padding: var(--space-lg);
                border-radius: var(--radius-md);
                margin-top: var(--space-lg);
                display: flex;
                gap: var(--space-lg);
                flex-wrap: wrap;
                align-items: center;
            ">
                <div class="control-group">
                    <label for="sortBy" style="font-weight: 600; margin-right: var(--space-sm);">
                        Ordina per:
                    </label>
                    <select id="sortBy" class="form-select" style="display: inline-block; width: auto;">
                        <option value="relevance">Rilevanza</option>
                        <option value="price-asc">Prezzo: crescente</option>
                        <option value="price-desc">Prezzo: decrescente</option>
                        <option value="discount">Sconto</option>
                        <option value="rating">Valutazione</option>
                    </select>
                </div>

                <div class="control-group">
                    <label for="priceFilter" style="font-weight: 600; margin-right: var(--space-sm);">
                        Prezzo max (€):
                    </label>
                    <input type="number" id="priceFilter" class="form-input"
                        placeholder="Es: 100" min="0" step="0.01"
                        style="display: inline-block; width: 120px; padding: var(--space-sm) var(--space-md);">
                </div>

                <div class="control-group">
                    <label for="ratingFilter" style="font-weight: 600; margin-right: var(--space-sm);">
                        Rating min:
                    </label>
                    <select id="ratingFilter" class="form-select" style="display: inline-block; width: auto;">
                        <option value="">Tutti</option>
                        <option value="4">4+ stelle</option>
                        <option value="3">3+ stelle</option>
                    </select>
                </div>

                <button id="resetFilters" class="btn btn-primary" style="margin-left: auto;">
                    Resetta Filtri
                </button>
            </div>
        `;

        resultsInfo.insertAdjacentHTML('afterend', controlsHTML);

        // Attach event listeners
        document.getElementById('sortBy').addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });

        document.getElementById('priceFilter').addEventListener('input', (e) => {
            const maxPrice = parseFloat(e.target.value);
            filterByPrice(maxPrice);
        });

        document.getElementById('ratingFilter').addEventListener('change', (e) => {
            const minRating = parseFloat(e.target.value);
            filterByRating(minRating);
        });

        document.getElementById('resetFilters').addEventListener('click', () => {
            // Reset all filters
            document.getElementById('priceFilter').value = '';
            document.getElementById('ratingFilter').value = '';
            document.getElementById('sortBy').value = 'relevance';

            // Show all products
            products.forEach(card => {
                card.style.display = 'block';
            });
        });
    }
});

// Export results button (if exists)
const exportBtn = document.getElementById('exportResults');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        // Collect product data from DOM
        const products = Array.from(document.querySelectorAll('.product-card')).map(card => {
            return {
                asin: card.querySelector('.product-asin')?.textContent.replace('ASIN: ', '') || '',
                title: card.querySelector('.product-title')?.textContent || '',
                brand: card.querySelector('.product-brand')?.textContent || '',
                price: {
                    current: card.querySelector('.price-current')?.textContent || 'N/A',
                    original: card.querySelector('.price-original')?.textContent || 'N/A',
                    discount_percent: card.querySelector('.badge-discount')?.textContent.replace(/[-%]/g, '') || 0
                },
                is_prime: !!card.querySelector('.badge-prime'),
                rating: {
                    stars: parseFloat(card.querySelector('.rating-value')?.textContent) || 0,
                    count: parseInt(card.querySelector('.rating-count')?.textContent.replace(/[()]/g, '')) || 0
                },
                url: card.querySelector('.btn-amazon')?.href || ''
            };
        });

        exportToCSV(products);
    });
}
