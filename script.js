/* ═══════════════════════════════════════════════════════════
   AMYWING'S GARDEN — script.js
   Complete E-Commerce Logic with Admin Panel
   All data persisted in localStorage
═══════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────
   DEFAULT DATA & CONSTANTS
──────────────────────────────────────── */

const ADMIN_PASSWORD_KEY   = 'ag_admin_password';
const PRODUCTS_KEY         = 'ag_products';
const SETTINGS_KEY         = 'ag_settings';
const CART_KEY             = 'ag_cart';
const WISHLIST_KEY         = 'ag_wishlist';

// Default admin password (changeable from settings)
const DEFAULT_PASSWORD = 'amywing2024';

// Default site settings
const DEFAULT_SETTINGS = {
  logoText:     "Amywing's Garden",
  tagline:      'Luxury blooms, delivered with love.',
  heroTitle:    'Where Every Bloom Tells a Story',
  heroSub:      'Discover luxury flower bouquets curated for every occasion — romantic anniversaries, joyful graduations, and heartfelt celebrations.',
  heroEyebrow:  'Est. 2024 · Hand-crafted with love',
  aboutTitle:   'Born from a Love of Flowers',
  aboutBody:    "Amywing's Garden was founded with a single dream — to share the quiet magic of fresh blooms with the world. Every bouquet is hand-crafted by our passionate florists using only the freshest, ethically-sourced flowers.",
  phone:        '+63 912 345 6789',
  gcash:        '0912 345 6789',
  email:        'hello@amywingsgarden.com',
  address:      'Davao City, Philippines',
  categoriesTitle: 'Our Collections',
  categoriesSub:   'Find the perfect bouquet for every emotion and occasion',
};

// Default products (emoji-only for portability)
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Scarlet Romance',
    category: 'Romantic',
    price: 1450,
    description: 'A passionate arrangement of deep red roses and lush greenery — the classic symbol of love and devotion.',
    rating: 4.9,
    reviews: 48,
    stock: 12,
    image: '',
    emoji: '🌹',
    isNew: true,
  },
  {
    id: 'p2',
    name: 'Blushing Tulip Garden',
    category: 'Tulips',
    price: 980,
    description: 'A soft, dreamy bouquet of mixed-color tulips wrapped in romantic blush tissue — perfect for birthdays or just because.',
    rating: 4.8,
    reviews: 35,
    stock: 8,
    image: '',
    emoji: '🌷',
    isNew: false,
  },
  {
    id: 'p3',
    name: 'Golden Sunshine',
    category: 'Sunflowers',
    price: 850,
    description: 'Bright, cheerful sunflowers bursting with warmth and joy. A beautiful gift to lift anyone\'s spirits.',
    rating: 4.7,
    reviews: 29,
    stock: 15,
    image: '',
    emoji: '🌻',
    isNew: false,
  },
  {
    id: 'p4',
    name: 'Graduate\'s Pride',
    category: 'Graduation',
    price: 1200,
    description: 'Celebrate achievements with this stunning mixed bouquet of lilies, roses, and white blooms — elegance for a milestone moment.',
    rating: 4.9,
    reviews: 62,
    stock: 6,
    image: '',
    emoji: '🎓',
    isNew: true,
  },
  {
    id: 'p5',
    name: 'Pink Petal Dream',
    category: 'Roses',
    price: 1300,
    description: 'An enchanting collection of soft pink roses, baby\'s breath, and eucalyptus — delicate, feminine, and absolutely romantic.',
    rating: 5.0,
    reviews: 71,
    stock: 10,
    image: '',
    emoji: '🌸',
    isNew: false,
  },
  {
    id: 'p6',
    name: 'Amywing Signature',
    category: 'Custom',
    price: 2200,
    description: 'Our signature custom bouquet — designed just for you. Tell us your vision and we\'ll make it bloom into reality.',
    rating: 4.9,
    reviews: 44,
    stock: 5,
    image: '',
    emoji: '💐',
    isNew: true,
  },
  {
    id: 'p7',
    name: 'Sunrise Bliss',
    category: 'Sunflowers',
    price: 760,
    description: 'A cheerful mix of sunflowers and orange marigolds bringing the warmth of sunrise to your doorstep.',
    rating: 4.6,
    reviews: 18,
    stock: 20,
    image: '',
    emoji: '🌼',
    isNew: false,
  },
  {
    id: 'p8',
    name: 'Velvet Romance Bundle',
    category: 'Romantic',
    price: 1850,
    description: 'A grand declaration of love — deep red and magenta roses paired with white orchids in our signature velvet wrap.',
    rating: 4.8,
    reviews: 53,
    stock: 0,
    image: '',
    emoji: '🌺',
    isNew: false,
  },
];

/* ────────────────────────────────────────
   STATE
──────────────────────────────────────── */
let products  = [];
let settings  = {};
let cart      = [];
let wishlist  = [];
let currentCategory = 'All';
let currentSort     = 'default';
let searchQuery     = '';
let isAdminOpen     = false;
let editingProductId = null;

/* ────────────────────────────────────────
   LOCALSTORAGE HELPERS
──────────────────────────────────────── */
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ────────────────────────────────────────
   INIT  — runs on DOMContentLoaded
──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  runLoader();
  buildParticles();
  applySettings();
  renderProducts();
  updateBadges();
  initNav();
  initTheme();
  initSearch();
  initCategories();
  initCart();
  initWishlist();
  initCheckout();
  initContact();
  initAdminLogin();
  initAdminPanel();
  initReveal();
  initFab();
  initBarChart();
});

/* ────────────────────────────────────────
   DATA LOADING
──────────────────────────────────────── */
function loadData() {
  products  = lsGet(PRODUCTS_KEY,  DEFAULT_PRODUCTS);
  settings  = lsGet(SETTINGS_KEY,  DEFAULT_SETTINGS);
  cart      = lsGet(CART_KEY,      []);
  wishlist  = lsGet(WISHLIST_KEY,  []);

  // Merge any missing setting keys with defaults
  settings = Object.assign({}, DEFAULT_SETTINGS, settings);
}

function saveAll() {
  lsSet(PRODUCTS_KEY,  products);
  lsSet(SETTINGS_KEY,  settings);
  lsSet(CART_KEY,      cart);
  lsSet(WISHLIST_KEY,  wishlist);
}

/* ────────────────────────────────────────
   LOADER
──────────────────────────────────────── */
function runLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      bar.style.width = '100%';
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 400);
    } else {
      bar.style.width = progress + '%';
    }
  }, 80);
}

/* ────────────────────────────────────────
   PARTICLES
──────────────────────────────────────── */
function buildParticles() {
  const container = document.getElementById('particles');
  const colors = ['#ffc1d9','#ff8fb3','#f7618c','#fde4f0','#ffe0ec'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 4;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 12}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

/* ────────────────────────────────────────
   APPLY SETTINGS TO DOM
──────────────────────────────────────── */
function applySettings() {
  // Logo
  const logoEls = document.querySelectorAll('#logoText');
  logoEls.forEach(el => { el.textContent = settings.logoText; });

  // Hero
  const heroTitle   = document.getElementById('heroTitle');
  const heroSub     = document.getElementById('heroSubtitle');
  const heroEyebrow = document.getElementById('heroEyebrow');
  if (heroTitle)   heroTitle.innerHTML   = settings.heroTitle.replace('Tells a Story', '<em>Tells a Story</em>');
  if (heroSub)     heroSub.textContent   = settings.heroSub;
  if (heroEyebrow) heroEyebrow.textContent = settings.heroEyebrow;

  // About
  const aboutTitle = document.getElementById('aboutTitle');
  const aboutBody  = document.getElementById('aboutBody');
  if (aboutTitle) aboutTitle.textContent = settings.aboutTitle;
  if (aboutBody)  aboutBody.textContent  = settings.aboutBody;

  // Footer
  const footerTagline = document.getElementById('footerTagline');
  if (footerTagline) footerTagline.textContent = settings.tagline;

  // Contact
  const cPhone   = document.getElementById('contactPhone');
  const cEmail   = document.getElementById('contactEmail');
  const cAddress = document.getElementById('contactAddress');
  if (cPhone)   cPhone.textContent   = settings.phone;
  if (cEmail)   cEmail.textContent   = settings.email;
  if (cAddress) cAddress.textContent = settings.address;

  // GCash info in checkout
  const gcashNum = document.getElementById('gcashNumber');
  if (gcashNum) gcashNum.textContent = settings.gcash;
}

/* ────────────────────────────────────────
   NAVBAR
──────────────────────────────────────── */
function initNav() {
  // Scroll effects
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveLink();
  });

  // Hamburger
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Admin trigger (hidden "·" in footer)
  const adminTrigger = document.getElementById('adminTrigger');
  if (adminTrigger) {
    adminTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminLogin();
    });
  }

  highlightActiveLink();
}

function highlightActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ────────────────────────────────────────
   THEME TOGGLE
──────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('ag_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', () => {
    const html    = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next    = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ag_theme', next);
  });
}

/* ────────────────────────────────────────
   SEARCH
──────────────────────────────────────── */
function initSearch() {
  const toggleBtn = document.getElementById('searchToggleBtn');
  const dropdown  = document.getElementById('searchDropdown');
  const input     = document.getElementById('searchInput');
  const results   = document.getElementById('searchResults');

  toggleBtn.addEventListener('click', () => {
    dropdown.classList.toggle('open');
    if (dropdown.classList.contains('open')) input.focus();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
      dropdown.classList.remove('open');
    }
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    searchQuery = q;

    if (!q) { results.innerHTML = ''; return; }

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 6);

    if (matches.length === 0) {
      results.innerHTML = '<div style="padding:.5rem;font-size:.8rem;color:var(--text-muted);">No results found.</div>';
    } else {
      results.innerHTML = matches.map(p => `
        <div class="search-result-item" data-id="${p.id}">
          <span style="font-size:1.2rem;">${p.emoji || '🌸'}</span>
          <div>
            <div style="font-weight:500;">${p.name}</div>
            <div style="font-size:.72rem;color:var(--text-muted);">₱${p.price.toLocaleString()} · ${p.category}</div>
          </div>
        </div>
      `).join('');

      results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.dataset.id;
          const product = products.find(p => p.id === id);
          if (product) { openProductModal(product); dropdown.classList.remove('open'); input.value = ''; }
        });
      });
    }
  });
}

/* ────────────────────────────────────────
   CATEGORIES
──────────────────────────────────────── */
function initCategories() {
  document.querySelectorAll('.cat-card').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-card').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      renderProducts();
      // Smooth scroll to products
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ────────────────────────────────────────
   PRODUCTS RENDERING
──────────────────────────────────────── */
function getFilteredProducts() {
  let list = [...products];

  // Category filter
  if (currentCategory !== 'All') {
    list = list.filter(p => p.category === currentCategory);
  }

  // Search filter
  if (searchQuery) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  // Sort
  switch (currentSort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }

  return list;
}

function renderProducts() {
  const grid       = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  const countEl    = document.getElementById('productCount');
  const list       = getFilteredProducts();

  if (list.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    if (countEl) countEl.textContent = '0 bouquets';
    return;
  }

  emptyState.style.display = 'none';
  if (countEl) countEl.textContent = `${list.length} bouquet${list.length !== 1 ? 's' : ''}`;

  grid.innerHTML = list.map(p => buildProductCard(p)).join('');

  // Staggered reveal
  grid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
    setTimeout(() => card.classList.add('visible'), 60 * i + 50);
  });

  // Bind events
  grid.querySelectorAll('.card-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('.product-card').dataset.id;
      const product = products.find(p => p.id === id);
      if (product && product.stock > 0) openCheckoutDirect(product);
    });
  });

  grid.querySelectorAll('.card-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('.product-card').dataset.id;
      const product = products.find(p => p.id === id);
      if (product && product.stock > 0) addToCart(product);
    });
  });

  grid.querySelectorAll('.card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.closest('.product-card').dataset.id;
      toggleWishlist(id, btn);
    });
  });

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const id = card.dataset.id;
      const product = products.find(p => p.id === id);
      if (product) openProductModal(product);
    });
  });
}

function buildProductCard(p) {
  const inWishlist = wishlist.includes(p.id);
  const oos        = p.stock === 0;
  const stars      = renderStars(p.rating);

  let imgHtml = '';
  if (p.image) {
    imgHtml = `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
               <div class="card-img-emoji" style="display:none;">${p.emoji || '🌸'}</div>`;
  } else {
    imgHtml = `<div class="card-img-emoji">${p.emoji || '🌸'}</div>`;
  }

  const badge = oos
    ? '<div class="oos-badge">Out of Stock</div>'
    : p.isNew ? '<div class="new-badge">New ✨</div>' : '';

  const stockText = oos
    ? '<div class="card-stock low">⚠ Out of stock</div>'
    : p.stock <= 5
      ? `<div class="card-stock low">Only ${p.stock} left!</div>`
      : `<div class="card-stock">${p.stock} in stock</div>`;

  return `
    <article class="product-card reveal" data-id="${p.id}" tabindex="0" aria-label="${escapeHtml(p.name)}">
      <div class="card-img-wrap">
        ${imgHtml}
        ${badge}
        <button class="card-wishlist ${inWishlist ? 'active' : ''}" aria-label="Wishlist" title="Add to wishlist">
          ${inWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div class="card-category">${escapeHtml(p.category)}</div>
        <h3 class="card-name">${escapeHtml(p.name)}</h3>
        <p class="card-desc">${escapeHtml(p.description)}</p>
        <div class="card-meta">
          <div class="card-price">₱${Number(p.price).toLocaleString()}</div>
          <div class="card-rating">
            <span class="stars">${stars}</span>
            <span class="rating-count">(${p.reviews})</span>
          </div>
        </div>
        ${stockText}
        <div class="card-actions">
          <button class="card-buy${oos ? ' disabled' : ''}" ${oos ? 'disabled' : ''}>
            ${oos ? 'Out of Stock' : 'Buy Now 🌸'}
          </button>
          <button class="card-cart" aria-label="Add to cart" ${oos ? 'disabled style="opacity:.5;pointer-events:none;"' : ''} title="Add to cart">
            🛒
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// Sort select
document.addEventListener('change', (e) => {
  if (e.target.id === 'sortSelect') {
    currentSort = e.target.value;
    renderProducts();
  }
});

/* ────────────────────────────────────────
   PRODUCT DETAIL MODAL
──────────────────────────────────────── */
function openProductModal(p) {
  const overlay = document.getElementById('productOverlay');
  const inner   = document.getElementById('productModalInner');
  const inWishlist = wishlist.includes(p.id);
  const oos     = p.stock === 0;
  const stars   = renderStars(p.rating);

  let imgHtml = '';
  if (p.image) {
    imgHtml = `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<span style=font-size:5rem>${p.emoji || '🌸'}</span>'" />`;
  } else {
    imgHtml = `<span style="font-size:5rem;">${p.emoji || '🌸'}</span>`;
  }

  inner.innerHTML = `
    <div class="pm-img">${imgHtml}</div>
    <div class="pm-info">
      <div class="pm-category">${escapeHtml(p.category)}</div>
      <h2 class="pm-name">${escapeHtml(p.name)}</h2>
      <div class="pm-rating">
        <span class="stars" style="font-size:1rem;">${stars}</span>
        <span style="font-size:.85rem;color:var(--text-muted);">${p.rating} (${p.reviews} reviews)</span>
      </div>
      <p class="pm-desc">${escapeHtml(p.description)}</p>
      <div class="pm-price">₱${Number(p.price).toLocaleString()}</div>
      <div class="pm-actions">
        ${oos
          ? '<button class="btn-primary" disabled style="opacity:.6;cursor:not-allowed;">Out of Stock</button>'
          : `<button class="btn-primary" id="pmBuyBtn">Buy Now 🌸</button>
             <button class="btn-ghost"   id="pmCartBtn">Add to Cart 🛒</button>`
        }
        <button class="btn-ghost" id="pmWishBtn" style="border-color:var(--pink-200);">
          ${inWishlist ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
        </button>
      </div>
    </div>
  `;

  overlay.classList.add('open');

  const pmBuyBtn  = document.getElementById('pmBuyBtn');
  const pmCartBtn = document.getElementById('pmCartBtn');
  const pmWishBtn = document.getElementById('pmWishBtn');

  if (pmBuyBtn) pmBuyBtn.addEventListener('click',  () => { closeProductModal(); openCheckoutDirect(p); });
  if (pmCartBtn) pmCartBtn.addEventListener('click', () => { addToCart(p); closeProductModal(); });
  if (pmWishBtn) pmWishBtn.addEventListener('click', () => {
    toggleWishlist(p.id, null);
    const nowIn = wishlist.includes(p.id);
    pmWishBtn.textContent = nowIn ? '❤️ Wishlisted' : '🤍 Add to Wishlist';
  });
}

function closeProductModal() {
  document.getElementById('productOverlay').classList.remove('open');
}

document.getElementById('productClose').addEventListener('click', closeProductModal);
document.getElementById('productOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeProductModal();
});

/* ────────────────────────────────────────
   CART
──────────────────────────────────────── */
function initCart() {
  const cartBtn     = document.getElementById('cartBtn');
  const cartClose   = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const checkoutBtn = document.getElementById('checkoutBtn');

  cartBtn.addEventListener('click',     openCart);
  cartClose.addEventListener('click',   closeCart);
  cartOverlay.addEventListener('click', closeCart);
  checkoutBtn.addEventListener('click', () => { closeCart(); openCheckout(); });

  renderCart();
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty++;
    } else {
      showToast('⚠ Maximum stock reached!', 'error');
      return;
    }
  } else {
    cart.push({ id: product.id, qty: 1 });
  }
  lsSet(CART_KEY, cart);
  updateBadges();
  renderCart();
  showToast(`🌸 ${product.name} added to cart!`, 'success');

  // Bounce animation on cart icon
  const cartBtn = document.getElementById('cartBtn');
  cartBtn.classList.add('cart-bounce');
  setTimeout(() => cartBtn.classList.remove('cart-bounce'), 600);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  lsSet(CART_KEY, cart);
  updateBadges();
  renderCart();
}

function changeQty(id, delta) {
  const item    = cart.find(i => i.id === id);
  const product = products.find(p => p.id === id);
  if (!item || !product) return;
  item.qty += delta;
  if (item.qty <= 0)             removeFromCart(id);
  else if (item.qty > product.stock) { showToast('⚠ Not enough stock!', 'error'); item.qty = product.stock; }
  lsSet(CART_KEY, cart);
  updateBadges();
  renderCart();
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-sidebar">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty.<br/>Add some lovely bouquets!</p>
      </div>`;
    totalEl.textContent = '₱0.00';
    return;
  }

  let total = 0;
  itemsEl.innerHTML = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return '';
    const subtotal = p.price * item.qty;
    total += subtotal;
    const imgHtml = p.image
      ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.parentElement.innerHTML='<span style=font-size:2rem>${p.emoji}</span>'" />`
      : `<span style="font-size:2rem;">${p.emoji || '🌸'}</span>`;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${imgHtml}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtml(p.name)}</div>
          <div class="cart-item-price">₱${subtotal.toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="minus" data-id="${p.id}">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" data-action="plus"  data-id="${p.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${p.id}" title="Remove">✕</button>
      </div>`;
  }).join('');

  totalEl.textContent = `₱${total.toLocaleString()}`;

  // Bind qty buttons
  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = btn.dataset.id;
      const delta = btn.dataset.action === 'plus' ? 1 : -1;
      changeQty(id, delta);
    });
  });
  itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const p = products.find(pr => pr.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

/* ────────────────────────────────────────
   WISHLIST
──────────────────────────────────────── */
function initWishlist() {
  const wishlistBtn     = document.getElementById('wishlistBtn');
  const wishlistClose   = document.getElementById('wishlistClose');
  const wishlistOverlay = document.getElementById('wishlistOverlay');

  wishlistBtn.addEventListener('click',     openWishlist);
  wishlistClose.addEventListener('click',   closeWishlist);
  wishlistOverlay.addEventListener('click', closeWishlist);

  // Footer wishlist link
  const footerWishlist = document.getElementById('footerWishlist');
  if (footerWishlist) footerWishlist.addEventListener('click', (e) => { e.preventDefault(); openWishlist(); });

  renderWishlist();
}

function openWishlist() {
  document.getElementById('wishlistSidebar').classList.add('open');
  document.getElementById('wishlistOverlay').classList.add('open');
}
function closeWishlist() {
  document.getElementById('wishlistSidebar').classList.remove('open');
  document.getElementById('wishlistOverlay').classList.remove('open');
}

function toggleWishlist(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    showToast('❤️ Added to wishlist!', 'success');
  } else {
    wishlist.splice(idx, 1);
    showToast('🤍 Removed from wishlist.', 'info');
  }
  lsSet(WISHLIST_KEY, wishlist);
  updateBadges();
  renderWishlist();
  renderProducts();

  if (btn) {
    const inNow = wishlist.includes(id);
    btn.textContent = inNow ? '❤️' : '🤍';
    btn.classList.toggle('active', inNow);
  }
}

function renderWishlist() {
  const el = document.getElementById('wishlistItems');

  if (wishlist.length === 0) {
    el.innerHTML = `
      <div class="empty-sidebar">
        <div class="empty-icon">💕</div>
        <p>Your wishlist is empty.<br/>Save your favourites!</p>
      </div>`;
    return;
  }

  el.innerHTML = wishlist.map(id => {
    const p = products.find(pr => pr.id === id);
    if (!p) return '';
    const imgHtml = p.image
      ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.parentElement.innerHTML='<span style=font-size:2rem>${p.emoji}</span>'" />`
      : `<span style="font-size:2rem;">${p.emoji || '🌸'}</span>`;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${imgHtml}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtml(p.name)}</div>
          <div class="cart-item-price">₱${Number(p.price).toLocaleString()}</div>
          <button class="btn-primary" style="margin-top:.4rem;padding:.4rem .8rem;font-size:.75rem;" data-wl-buy="${p.id}">Buy Now</button>
        </div>
        <button class="cart-item-remove" data-wl-id="${p.id}" title="Remove">✕</button>
      </div>`;
  }).join('');

  el.querySelectorAll('[data-wl-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = products.find(pr => pr.id === btn.dataset.wlBuy);
      if (p) { closeWishlist(); openCheckoutDirect(p); }
    });
  });
  el.querySelectorAll('[data-wl-id]').forEach(btn => {
    btn.addEventListener('click', () => toggleWishlist(btn.dataset.wlId, null));
  });
}

/* ────────────────────────────────────────
   CHECKOUT
──────────────────────────────────────── */
function initCheckout() {
  const overlay   = document.getElementById('checkoutOverlay');
  const closeBtn  = document.getElementById('checkoutClose');
  const form      = document.getElementById('checkoutForm');

  closeBtn.addEventListener('click', closeCheckout);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCheckout(); });

  // Payment method change
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const gcashInfo = document.getElementById('gcashInfo');
      gcashInfo.style.display = radio.value === 'GCash' ? 'block' : 'none';
    });
  });

  form.addEventListener('submit', handleCheckoutSubmit);
}

function openCheckout() {
  if (cart.length === 0) { showToast('🛒 Your cart is empty!', 'error'); return; }
  populateOrderSummary();
  document.getElementById('checkoutOverlay').classList.add('open');
}

function openCheckoutDirect(product) {
  // Add product to cart if not there, then open checkout
  const existing = cart.find(i => i.id === product.id);
  if (!existing) cart.push({ id: product.id, qty: 1 });
  lsSet(CART_KEY, cart);
  updateBadges();
  renderCart();
  populateOrderSummary();
  // Pre-fill order
  const coOrder = document.getElementById('co-order');
  if (coOrder) coOrder.value = product.name;
  document.getElementById('checkoutOverlay').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
}

function populateOrderSummary() {
  const summaryItems = document.getElementById('summaryItems');
  const summaryTotal = document.getElementById('summaryTotal');
  let total = 0;
  let rows  = '';

  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return;
    const sub = p.price * item.qty;
    total += sub;
    rows += `<div class="summary-item"><span>${escapeHtml(p.name)} × ${item.qty}</span><span>₱${sub.toLocaleString()}</span></div>`;
  });

  if (!rows) rows = '<div class="summary-item"><span style="color:var(--text-muted);">No items yet</span><span></span></div>';
  summaryItems.innerHTML = rows;
  summaryTotal.textContent = `₱${total.toLocaleString()}`;
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('co-name').value.trim();
  const address = document.getElementById('co-address').value.trim();
  const phone   = document.getElementById('co-phone').value.trim();
  const order   = document.getElementById('co-order').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const total   = getCartTotal();

  if (!name || !address || !phone) {
    showToast('⚠ Please fill in all required fields.', 'error');
    return;
  }

  // Build order message
  const orderLines = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    return p ? `• ${p.name} × ${item.qty} = ₱${(p.price * item.qty).toLocaleString()}` : '';
  }).filter(Boolean).join('\n');

  const message = encodeURIComponent(
    `🌸 *New Order — Amywing's Garden* 🌸\n\n` +
    `👤 Name: ${name}\n` +
    `📍 Address: ${address}\n` +
    `📱 Contact: ${phone}\n` +
    `💳 Payment: ${payment}\n\n` +
    `🛒 *Order Details:*\n${orderLines || order}\n\n` +
    `💰 *Total: ₱${total.toLocaleString()}*\n\n` +
    `Thank you for ordering from Amywing's Garden! 🌹`
  );

  const adminPhone = (settings.phone || '+63 912 345 6789').replace(/\D/g, '');

  closeCheckout();

  // Show success & open contact methods
  showToast('✅ Order placed! Contacting seller…', 'success');

  // Open messenger / SMS
  setTimeout(() => {
    const choice = confirm(
      `Your order total is ₱${total.toLocaleString()}.\n\n` +
      `Click OK to message us on Messenger, or Cancel to open SMS.`
    );
    if (choice) {
      // Messenger (use phone link fallback)
      window.open(`https://m.me/${adminPhone}`, '_blank');
    } else {
      window.open(`sms:${adminPhone}?body=${message}`, '_blank');
    }
  }, 800);

  // Clear cart
  cart = [];
  lsSet(CART_KEY, cart);
  updateBadges();
  renderCart();

  // Reset form
  document.getElementById('checkoutForm').reset();
}

/* ────────────────────────────────────────
   CONTACT FORM
──────────────────────────────────────── */
function initContact() {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('💌 Message sent! We\'ll reply soon.', 'success');
    form.reset();
  });
}

/* ────────────────────────────────────────
   BADGES
──────────────────────────────────────── */
function updateBadges() {
  const cartTotal    = cart.reduce((s, i) => s + i.qty, 0);
  const wishlistTotal = wishlist.length;

  const cartBadge     = document.getElementById('cartCount');
  const wishBadge     = document.getElementById('wishlistCount');

  cartBadge.textContent  = cartTotal;
  wishBadge.textContent  = wishlistTotal;

  animateBadge(cartBadge);
  animateBadge(wishBadge);
}

function animateBadge(el) {
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 400);
}

/* ────────────────────────────────────────
   FLOATING CHAT FAB
──────────────────────────────────────── */
function initFab() {
  const fab = document.getElementById('chatFab');
  fab.addEventListener('click', () => {
    const phone   = (settings.phone || '+63 912 345 6789').replace(/\D/g, '');
    const message = encodeURIComponent("Hi Amywing's Garden! I'd like to know more about your bouquets. 🌸");
    window.open(`https://m.me/${phone}`, '_blank');
  });
}

/* ────────────────────────────────────────
   TOAST NOTIFICATIONS
──────────────────────────────────────── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons     = { success: '✅', error: '❌', info: '🌸' };
  const toast     = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-ico">${icons[type] || '🌸'}</span>${escapeHtml(message)}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/* ────────────────────────────────────────
   SCROLL REVEAL
──────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────
   ADMIN LOGIN
──────────────────────────────────────── */
function initAdminLogin() {
  const loginClose = document.getElementById('adminLoginClose');
  const loginBtn   = document.getElementById('adminLoginBtn');
  const input      = document.getElementById('adminPasswordInput');
  const errorEl    = document.getElementById('adminLoginError');

  loginClose.addEventListener('click', closeAdminLogin);
  document.getElementById('adminLoginOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('adminLoginOverlay')) closeAdminLogin();
  });

  loginBtn.addEventListener('click', attemptAdminLogin);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptAdminLogin(); });

  function attemptAdminLogin() {
    const pw      = input.value;
    const correct = lsGet(ADMIN_PASSWORD_KEY, DEFAULT_PASSWORD);
    if (pw === correct) {
      closeAdminLogin();
      openAdminPanel();
      input.value = '';
      errorEl.style.display = 'none';
    } else {
      errorEl.style.display = 'block';
      input.value = '';
      input.focus();
    }
  }
}

function openAdminLogin() {
  document.getElementById('adminLoginOverlay').classList.add('open');
  setTimeout(() => document.getElementById('adminPasswordInput').focus(), 300);
}
function closeAdminLogin() {
  document.getElementById('adminLoginOverlay').classList.remove('open');
  document.getElementById('adminLoginError').style.display = 'none';
  document.getElementById('adminPasswordInput').value = '';
}

/* ────────────────────────────────────────
   ADMIN PANEL
──────────────────────────────────────── */
function initAdminPanel() {
  // Tab switching
  document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const tabId = `tab-${btn.dataset.tab}`;
      document.getElementById(tabId).classList.add('active');

      if (btn.dataset.tab === 'products')    renderAdminProducts();
      if (btn.dataset.tab === 'dashboard')   { updateDashboard(); initBarChart(); }
      if (btn.dataset.tab === 'settings')    populateSettings();
    });
  });

  // Logout
  document.getElementById('adminLogout').addEventListener('click', () => {
    closeAdminPanel();
    showToast('👋 Logged out of admin panel.', 'info');
  });

  // Product form
  document.getElementById('adminProductForm').addEventListener('submit', handleProductSave);

  // Cancel edit
  document.getElementById('cancelEditBtn').addEventListener('click', () => {
    editingProductId = null;
    document.getElementById('adminProductForm').reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('addProductTabTitle').textContent = 'Add New Product';
    document.getElementById('cancelEditBtn').style.display = 'none';
  });

  // Save settings
  document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);

  // Overlay close
  document.getElementById('adminPanelOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('adminPanelOverlay')) closeAdminPanel();
  });
}

function openAdminPanel() {
  const overlay = document.getElementById('adminPanelOverlay');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('open'));
  updateDashboard();
  populateSettings();
  isAdminOpen = true;
}
function closeAdminPanel() {
  const overlay = document.getElementById('adminPanelOverlay');
  overlay.classList.remove('open');
  setTimeout(() => { overlay.style.display = 'none'; }, 400);
  isAdminOpen = false;
}

/* ── Dashboard ── */
function updateDashboard() {
  document.getElementById('an-products').textContent = products.length;
  document.getElementById('an-wishlist').textContent = wishlist.length;
  document.getElementById('an-cart').textContent     = cart.reduce((s,i) => s + i.qty, 0);
  const avgRating = products.length
    ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)
    : '–';
  document.getElementById('an-rating').textContent = `${avgRating} ★`;
}

function initBarChart() {
  const chart = document.getElementById('barChart');
  if (!chart) return;
  const months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const values  = [24,38,31,52,44,63,58,75,69,82,71,90]; // simulated
  const maxVal  = Math.max(...values);
  chart.innerHTML = months.map((m, i) => {
    const pct = (values[i] / maxVal * 100).toFixed(0);
    return `
      <div class="bar-col">
        <div class="bar" style="height:${pct}%;"></div>
        <span class="bar-month">${m}</span>
      </div>`;
  }).join('');
}

/* ── Admin Product List ── */
function renderAdminProducts() {
  const list = document.getElementById('adminProductList');
  if (!products.length) {
    list.innerHTML = '<p style="color:var(--text-muted);padding:1rem;">No products yet. Add your first bouquet!</p>';
    return;
  }
  list.innerHTML = products.map(p => `
    <div class="admin-product-item" data-id="${p.id}">
      <div class="ap-emoji">
        ${p.image
          ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='${p.emoji||'🌸'}'" />`
          : p.emoji || '🌸'
        }
      </div>
      <div class="ap-info">
        <div class="ap-name">${escapeHtml(p.name)}</div>
        <div class="ap-meta">${p.category} · Stock: ${p.stock} · Rating: ${p.rating}★ (${p.reviews})</div>
      </div>
      <div class="ap-price">₱${Number(p.price).toLocaleString()}</div>
      <div class="ap-actions">
        <button class="ap-edit-btn" data-id="${p.id}">✏ Edit</button>
        <button class="ap-del-btn"  data-id="${p.id}">🗑 Delete</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.ap-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => startEditProduct(btn.dataset.id));
  });
  list.querySelectorAll('.ap-del-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
  });
}

/* ── Product CRUD ── */
function handleProductSave(e) {
  e.preventDefault();
  const name     = document.getElementById('ap-name').value.trim();
  const category = document.getElementById('ap-category').value;
  const price    = parseFloat(document.getElementById('ap-price').value) || 0;
  const stock    = parseInt(document.getElementById('ap-stock').value)   || 0;
  const rating   = parseFloat(document.getElementById('ap-rating').value)|| 4.5;
  const reviews  = parseInt(document.getElementById('ap-reviews').value) || 0;
  const desc     = document.getElementById('ap-desc').value.trim();
  const image    = document.getElementById('ap-image').value.trim();
  const emoji    = document.getElementById('ap-emoji').value.trim() || '🌸';

  if (!name) { showToast('⚠ Please enter a product name.', 'error'); return; }

  if (editingProductId) {
    // Edit existing
    const idx = products.findIndex(p => p.id === editingProductId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, category, price, stock, rating, reviews, description: desc, image, emoji };
      showToast('✅ Product updated!', 'success');
    }
    editingProductId = null;
    document.getElementById('editProductId').value = '';
    document.getElementById('addProductTabTitle').textContent = 'Add New Product';
    document.getElementById('cancelEditBtn').style.display = 'none';
  } else {
    // Add new
    const newProduct = {
      id: 'p_' + Date.now(),
      name, category, price, stock, rating, reviews,
      description: desc, image, emoji,
      isNew: true,
    };
    products.push(newProduct);
    showToast('🌸 New bouquet added!', 'success');
  }

  lsSet(PRODUCTS_KEY, products);
  document.getElementById('adminProductForm').reset();
  renderProducts();
  renderAdminProducts();
  updateDashboard();
}

function startEditProduct(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;

  editingProductId = id;
  document.getElementById('editProductId').value = id;
  document.getElementById('ap-name').value       = p.name;
  document.getElementById('ap-category').value   = p.category;
  document.getElementById('ap-price').value      = p.price;
  document.getElementById('ap-stock').value      = p.stock;
  document.getElementById('ap-rating').value     = p.rating;
  document.getElementById('ap-reviews').value    = p.reviews;
  document.getElementById('ap-desc').value       = p.description;
  document.getElementById('ap-image').value      = p.image || '';
  document.getElementById('ap-emoji').value      = p.emoji || '🌸';

  document.getElementById('addProductTabTitle').textContent = 'Edit Product';
  document.getElementById('cancelEditBtn').style.display    = 'inline-flex';

  // Switch to add tab
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  const addBtn = document.querySelector('[data-tab="addProduct"]');
  const addTab = document.getElementById('tab-addProduct');
  addBtn.classList.add('active');
  addTab.classList.add('active');
}

function deleteProduct(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  products = products.filter(p => p.id !== id);
  // Remove from cart & wishlist too
  cart     = cart.filter(i => i.id !== id);
  wishlist = wishlist.filter(wid => wid !== id);
  lsSet(PRODUCTS_KEY, products);
  lsSet(CART_KEY,     cart);
  lsSet(WISHLIST_KEY, wishlist);
  updateBadges();
  renderCart();
  renderWishlist();
  renderProducts();
  renderAdminProducts();
  updateDashboard();
  showToast('🗑 Product deleted.', 'info');
}

/* ── Settings ── */
function populateSettings() {
  document.getElementById('s-logoText').value   = settings.logoText     || '';
  document.getElementById('s-tagline').value    = settings.tagline      || '';
  document.getElementById('s-heroTitle').value  = settings.heroTitle    || '';
  document.getElementById('s-heroSub').value    = settings.heroSub      || '';
  document.getElementById('s-heroEyebrow').value= settings.heroEyebrow  || '';
  document.getElementById('s-aboutTitle').value = settings.aboutTitle   || '';
  document.getElementById('s-aboutBody').value  = settings.aboutBody    || '';
  document.getElementById('s-phone').value      = settings.phone        || '';
  document.getElementById('s-gcash').value      = settings.gcash        || '';
  document.getElementById('s-email').value      = settings.email        || '';
  document.getElementById('s-address').value    = settings.address      || '';
}

function saveSettings() {
  settings.logoText    = document.getElementById('s-logoText').value.trim()    || settings.logoText;
  settings.tagline     = document.getElementById('s-tagline').value.trim()     || settings.tagline;
  settings.heroTitle   = document.getElementById('s-heroTitle').value.trim()   || settings.heroTitle;
  settings.heroSub     = document.getElementById('s-heroSub').value.trim()     || settings.heroSub;
  settings.heroEyebrow = document.getElementById('s-heroEyebrow').value.trim() || settings.heroEyebrow;
  settings.aboutTitle  = document.getElementById('s-aboutTitle').value.trim()  || settings.aboutTitle;
  settings.aboutBody   = document.getElementById('s-aboutBody').value.trim()   || settings.aboutBody;
  settings.phone       = document.getElementById('s-phone').value.trim()       || settings.phone;
  settings.gcash       = document.getElementById('s-gcash').value.trim()       || settings.gcash;
  settings.email       = document.getElementById('s-email').value.trim()       || settings.email;
  settings.address     = document.getElementById('s-address').value.trim()     || settings.address;

  // Password change
  const newPw  = document.getElementById('s-newPassword').value;
  const confPw = document.getElementById('s-confirmPassword').value;
  if (newPw || confPw) {
    if (newPw !== confPw) { showToast('⚠ Passwords do not match!', 'error'); return; }
    if (newPw.length < 6) { showToast('⚠ Password must be at least 6 characters.', 'error'); return; }
    lsSet(ADMIN_PASSWORD_KEY, newPw);
    document.getElementById('s-newPassword').value    = '';
    document.getElementById('s-confirmPassword').value = '';
    showToast('🔐 Password updated!', 'success');
  }

  lsSet(SETTINGS_KEY, settings);
  applySettings();
  showToast('✅ Settings saved!', 'success');
}

/* ────────────────────────────────────────
   UTILITY — ESCAPE HTML
──────────────────────────────────────── */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ────────────────────────────────────────
   KEYBOARD SHORTCUTS
──────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeCheckout();
    closeCart();
    closeWishlist();
    if (isAdminOpen) closeAdminPanel();
  }
  // Ctrl+Shift+A = open admin (secret shortcut)
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    openAdminLogin();
  }
});

/* ────────────────────────────────────────
   WINDOW RESIZE — re-trigger reveals
──────────────────────────────────────── */
window.addEventListener('resize', () => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) el.classList.add('visible');
  });
});