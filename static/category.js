
/**
 * Tech Haven - Category Page JS
 * Products data, search, filter by category
 */

// ============================================
// ALL PRODUCTS DATA
// ============================================
const ALL_PRODUCTS = [
  { id: 1,  name: 'Keychron Q1 Pro',             category: 'keyboards',   price: 199,  image: 'images/prod-1.jpg' },
  { id: 2,  name: 'Logitech G Pro X Superlight',  category: 'mice',        price: 149,  image: 'images/prod-2.jpg' },
  { id: 3,  name: 'LG UltraGear 27" 240Hz',       category: 'monitors',    price: 449,  image: 'images/prod-3.jpg' },
  { id: 4,  name: 'MacBook Pro 14" M3',            category: 'laptops',     price: 1599, image: 'images/prod-4.jpg' },
  { id: 5,  name: 'Razer BlackWidow V4 Pro',       category: 'keyboards',   price: 229,  image: 'images/prod-5.jpg' },
  { id: 6,  name: 'Glorious Model O Wireless',     category: 'mice',        price: 79,   image: 'images/prod-6.jpg' },
  { id: 7,  name: 'Dell UltraSharp U2723D',        category: 'monitors',    price: 599,  image: 'images/prod-7.jpg' },
  { id: 8,  name: 'ASUS ROG Zephyrus G14',         category: 'laptops',     price: 1299, image: 'images/prod-8.jpg' },
  { id: 9,  name: 'Keychron K8 Pro',               category: 'keyboards',   price: 99,   image: 'images/prod-1.jpg' },
  { id: 10, name: 'Razer DeathAdder V3',           category: 'mice',        price: 69,   image: 'images/prod-2.jpg' },
  { id: 11, name: 'USB-C Hub 7-in-1',              category: 'accessories', price: 49,   image: 'images/prod-3.jpg' },
  { id: 12, name: 'Ergonomic Wrist Rest',          category: 'accessories', price: 29,   image: 'images/prod-4.jpg' },
];

const CATEGORY_META = {
  keyboards:   { title: 'Keyboards',    desc: 'Mechanical and wireless keyboards for every typing style.' },
  mice:        { title: 'Mice',         desc: 'Precision gaming and productivity mice.' },
  monitors:    { title: 'Monitors',     desc: 'High-refresh and colour-accurate displays.' },
  laptops:     { title: 'Laptops',      desc: 'Portable powerhouses for creators and developers.' },
  accessories: { title: 'Accessories',  desc: 'Essential add-ons to complete your setup.' },
  all:         { title: 'All Products', desc: 'Browse our full collection of premium tech gear.' },
};

// ============================================
// CATEGORY PAGE INIT
// ============================================
(function initCategoryPage() {
  const params     = new URLSearchParams(window.location.search);
  const catParam   = (params.get('cat') || 'all').toLowerCase();
  const meta       = CATEGORY_META[catParam] || CATEGORY_META['all'];

  // Update page title / breadcrumb
  document.getElementById('category-page-title').textContent = meta.title;
  document.getElementById('category-page-desc').textContent  = meta.desc;
  document.getElementById('breadcrumb-cat').textContent      = meta.title;
  document.title = `Tech Haven | ${meta.title}`;

  // Update search placeholder
  const searchInput = document.getElementById('category-search-input');
  if (catParam !== 'all') {
    searchInput.placeholder = `Search ${meta.title.toLowerCase()}…`;
  }

  // Highlight active filter tab
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === catParam || (catParam === 'all' && tab.dataset.filter === 'all'));
    tab.addEventListener('click', function() {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderProducts(this.dataset.filter, searchInput.value.trim());
      // Update URL without reload
      const newParams = new URLSearchParams(window.location.search);
      if (this.dataset.filter === 'all') {
        newParams.delete('cat');
      } else {
        newParams.set('cat', this.dataset.filter);
      }
      history.replaceState(null, '', '?' + newParams.toString());
      const newMeta = CATEGORY_META[this.dataset.filter] || CATEGORY_META['all'];
      document.getElementById('category-page-title').textContent = newMeta.title;
      document.getElementById('category-page-desc').textContent  = newMeta.desc;
      document.getElementById('breadcrumb-cat').textContent      = newMeta.title;
    });
  });

  // Search
  const clearBtn = document.getElementById('search-clear-btn');
  searchInput.addEventListener('input', function() {
    const activeFilter = document.querySelector('.filter-tab.active')?.dataset.filter || 'all';
    renderProducts(activeFilter, this.value.trim());
    clearBtn.style.display = this.value.length > 0 ? 'flex' : 'none';
  });
  clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    this.style.display = 'none';
    const activeFilter = document.querySelector('.filter-tab.active')?.dataset.filter || 'all';
    renderProducts(activeFilter, '');
    searchInput.focus();
  });

  // Initial render
  renderProducts(catParam, '');
})();

function renderProducts(categoryFilter, searchTerm) {
  const grid    = document.getElementById('category-products-grid');
  const noRes   = document.getElementById('no-results-msg');
  const infoEl  = document.getElementById('search-results-info');

  const term = searchTerm.toLowerCase();

  const filtered = ALL_PRODUCTS.filter(p => {
    const matchCat    = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch = !term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  // Info text
  if (term) {
    infoEl.textContent = filtered.length > 0
      ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchTerm}"`
      : '';
  } else {
    infoEl.textContent = '';
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }

  noRes.style.display = 'none';
  grid.innerHTML = filtered.map(p => `
    <div class="glass-card product-card cat-product-card">
      <a href="product.html?id=${p.id}" class="text-decoration-none">
        <div class="product-image-wrapper">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
      </a>
      <div class="product-name">${p.name}</div>
      <div class="product-category">${capitalize(p.category)}</div>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <button class="btn-add-cart"
        data-id="${p.id}"
        data-name="${p.name}"
        data-category="${capitalize(p.category)}"
        data-price="${p.price}"
        data-image="${p.image}">Add to Cart</button>
    </div>
  `).join('');

  // Re-bind add-to-cart
  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      Cart.add({
        id:       parseInt(btn.dataset.id),
        name:     btn.dataset.name,
        category: btn.dataset.category,
        price:    parseFloat(btn.dataset.price),
        image:    btn.dataset.image,
      });
    });
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
