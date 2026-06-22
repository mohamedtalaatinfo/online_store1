
/**
 * Tech Haven - Main JavaScript
 * Cart, interactions, animations, and utilities
 */

// ============================================
// CART STATE MANAGEMENT
// ============================================

const Cart = {
  items: [],

  init() {
    const saved = localStorage.getItem('techhaven_cart');
    if (saved) {
      try {
        this.items = JSON.parse(saved);
      } catch (e) {
        this.items = [];
      }
    }
    this.updateBadge();
  },

  save() {
    localStorage.setItem('techhaven_cart', JSON.stringify(this.items));
    this.updateBadge();
  },

  add(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.save();
    this.animateBadge();
    showToast(`${product.name} added to cart`);
  },

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
  },

  updateQuantity(id, quantity) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      if (quantity <= 0) {
        this.remove(id);
      } else {
        item.quantity = quantity;
        this.save();
      }
    }
  },

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const count = this.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  animateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
      }, 300);
    }
  }
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-tech';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// NAVBAR SCROLL BEHAVIOR
// ============================================

function initNavbar() {
  const navbar = document.querySelector('.navbar-tech');
  if (!navbar) return;

  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
  const toggler = document.querySelector('.navbar-toggler-tech');
  const collapseEl = document.getElementById('navbarNav');

  if (toggler && collapseEl) {
    // Use Bootstrap's Collapse API for proper animation + class management
    const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

    toggler.addEventListener('click', () => {
      bsCollapse.toggle();
    });

    // Close menu when a nav link is clicked (mobile UX)
    collapseEl.querySelectorAll('.nav-link-tech').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          bsCollapse.hide();
        }
      });
    });
  }
}

// ============================================
// QUANTITY SELECTORS
// ============================================

function initQuantitySelectors() {
  document.querySelectorAll('.quantity-selector').forEach(selector => {
    const minus = selector.querySelector('.qty-btn[data-action="minus"]');
    const plus = selector.querySelector('.qty-btn[data-action="plus"]');
    const display = selector.querySelector('.qty-value');
    
    if (minus && plus && display) {
      minus.addEventListener('click', () => {
        let val = parseInt(display.textContent) || 1;
        if (val > 1) {
          display.textContent = val - 1;
        }
      });
      
      plus.addEventListener('click', () => {
        let val = parseInt(display.textContent) || 1;
        display.textContent = val + 1;
      });
    }
  });
}

// ============================================
// CART PAGE FUNCTIONALITY
// ============================================

function initCartPage() {
  const cartContainer = document.getElementById('cart-items');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  
  if (!cartContainer) return;

  function renderCart() {
    if (Cart.items.length === 0) {
      if (emptyCart) emptyCart.style.display = 'block';
      if (cartContent) cartContent.style.display = 'none';
      return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'flex';

    cartContainer.innerHTML = Cart.items.map(item => `
      <div class="cart-item-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-category">${item.category}</div>
          <div class="cart-item-unit-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-selector">
            <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
            <div class="qty-value">${item.quantity}</div>
            <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
          </div>
          <button class="btn-remove" data-id="${item.id}">&times;</button>
        </div>
      </div>
    `).join('');

    updateSummary();
    bindCartEvents();
  }

  function updateSummary() {
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${Cart.getTotal().toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${Cart.getTotal().toFixed(2)}`;
  }

  function bindCartEvents() {
    cartContainer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const action = e.target.dataset.action;
        const item = Cart.items.find(i => i.id === id);
        if (!item) return;

        if (action === 'minus') {
          Cart.updateQuantity(id, item.quantity - 1);
        } else {
          Cart.updateQuantity(id, item.quantity + 1);
        }
        renderCart();
      });
    });

    cartContainer.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const card = cartContainer.querySelector(`[data-id="${id}"]`);
        if (card) {
          card.classList.add('removing');
          setTimeout(() => {
            Cart.remove(id);
            renderCart();
          }, 300);
        }
      });
    });
  }

  renderCart();
}

// ============================================
// PRODUCT DETAIL PAGE
// ============================================

function initProductDetail() {
  const mainImage = document.getElementById('main-product-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        mainImage.src = thumb.src;
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  // Add to cart on product detail
  const addBtn = document.getElementById('btn-add-detail');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const product = {
        id: parseInt(addBtn.dataset.id),
        name: addBtn.dataset.name,
        category: addBtn.dataset.category,
        price: parseFloat(addBtn.dataset.price),
        image: addBtn.dataset.image
      };
      const qtyEl = document.querySelector('.qty-value');
      const qty = qtyEl ? parseInt(qtyEl.textContent) || 1 : 1;
      
      for (let i = 0; i < qty; i++) {
        Cart.add(product);
      }
    });
  }
}

// ============================================
// ADD TO CART BUTTONS (GLOBAL)
// ============================================

function initAddToCartButtons() {
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = {
        id: parseInt(btn.dataset.id),
        name: btn.dataset.name,
        category: btn.dataset.category,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image
      };
      Cart.add(product);
    });
  });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initNavbar();
  initRevealAnimations();
  initMobileMenu();
  initQuantitySelectors();
  initCartPage();
  initProductDetail();
  initAddToCartButtons();
  initSmoothScroll();
});

// Make Cart available globally for inline onclick handlers
window.Cart = Cart;
