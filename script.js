// Estado global
let users = {
  demo: { password: "demo", balance: 5000, level: 5, xp: 2500 }
};
let currentUser = null;

// Base de datos de juegos actualizada con servicios específicos
const gameDatabase = {
  webStore: [
    { name:"EA SPORTS FC 25", serviceType:"Créditos FC", imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQehY3e0-kzgDj1EZuSHyHMazVcsVxQ8xyisw&s", min:100, basePrice:850, description:"El simulador de fútbol más realista del mundo con gráficos ultra HD", id:"EA025", category:"Sports" },
    { name:"Call of Duty: Mobile", serviceType:"CP (CoD Points)", imageUrl:"https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop", min:200, basePrice:1200, description:"Battle Royale y multijugador competitivo de élite", id:"COD025", category:"FPS" }
  ],
  popular: [
    { name:"Fortnite", serviceType:"V-Bucks", imageUrl:"https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop", min:100, basePrice:1500, description:"Battle Royale líder mundial con temporadas épicas", id:"FN025", category:"Battle Royale" },
    { name:"Free Fire MAX", serviceType:"Diamantes", imageUrl:"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop", min:100, basePrice:600, description:"Batalla rápida, supervivencia extrema, gráficos mejorados", id:"FF025", category:"Battle Royale" },
    { name:"PUBG Mobile", serviceType:"UC (Unknown Cash)", imageUrl:"https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=300&fit=crop", min:60, basePrice:800, description:"El Battle Royale más táctico y competitivo", id:"PUB025", category:"Battle Royale" },
    { name:"Mobile Legends", serviceType:"Diamantes ML", imageUrl:"https://www.shutterstock.com/image-vector/surakarta-indonesia-january-14-2024-260nw-2412511519.jpg", min:50, basePrice:500, description:"MOBA 5v5 más jugado del mundo", id:"ML025", category:"MOBA" },
    { name:"Genshin Impact", serviceType:"Génesis Crystals", imageUrl:"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop", min:60, basePrice:1000, description:"RPG mundo abierto con gráficos anime", id:"GI025", category:"RPG" },
    { name:"Clash Royale", serviceType:"Gemas", imageUrl:"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop", min:50, basePrice:400, description:"Estrategia en tiempo real con cartas", id:"CR025", category:"Strategy" }
  ],
  new: [
    { name:"Honkai: Star Rail", serviceType:"Oneiric Shards", imageUrl:"https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop", min:60, basePrice:1300, description:"RPG espacial con combate estratégico", id:"HSR025", category:"RPG", isNew:true },
    { name:"Diablo Immortal", serviceType:"Eternal Orbs", imageUrl:"https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop", min:50, basePrice:1100, description:"Action RPG demoniaco", id:"DI025", category:"Action RPG", isNew:true },
    { name:"Tower of Fantasy", serviceType:"Tanium", imageUrl:"https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop", min:60, basePrice:900, description:"MMORPG futurista mundo abierto", id:"TOF025", category:"MMORPG", isNew:true }
  ]
};

// Helpers DOM
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Elementos clave
let intro, auth, header, mainContent, footer, userInfo, guestActions, userDisplay, userBalance;
let sidebar, sidebarClose;
let webStoreEl, popularEl, newEl;
let purchaseModal, paymentModal, cancelPurchaseBtn, backToPurchaseBtn, toPaymentBtn, sendWhatsAppBtn;
let gameSelectedSel, amountSelectedInp, fullNameInp, phoneInp, dniInp;

// Inicio
document.addEventListener("DOMContentLoaded", () => {
  cacheEls();
  lockUntilLogin(true);
  startIntroThenAuth();
  bindGlobalEvents();
});

// Cache de elementos
function cacheEls() {
  intro = $("#intro");
  auth = $("#auth");
  header = $("#header");
  mainContent = $("#mainContent");
  footer = $("#footer");
  userInfo = $("#userInfo");
  guestActions = $("#guestActions");
  userDisplay = $("#userDisplay");
  userBalance = $("#userBalance");
  sidebar = $("#sidebar");
  sidebarClose = $("#sidebarClose");

  webStoreEl = $("#webStoreGames");
  popularEl = $("#popularGames");
  newEl = $("#newGames");

  purchaseModal = $("#purchaseModal");
  paymentModal = $("#paymentModal");
  cancelPurchaseBtn = $("#cancelPurchase");
  backToPurchaseBtn = $("#backToPurchase");
  toPaymentBtn = $("#toPayment");
  sendWhatsAppBtn = $("#sendWhatsApp");

  gameSelectedSel = $("#gameSelected");
  amountSelectedInp = $("#amountSelected");
  fullNameInp = $("#fullName");
  phoneInp = $("#phone");
  dniInp = $("#dni");
}

// Bloquear scroll hasta login
function lockUntilLogin(lock) {
  document.body.style.overflow = lock ? "hidden" : "";
}

// Intro con sponsor → Auth
function splitIntoSpans(el) {
  const text = el.textContent;
  el.textContent = "";
  for (const ch of text) {
    const s = document.createElement("span");
    s.className = "ch";
    s.textContent = ch;
    el.appendChild(s);
  }
}

function startIntroThenAuth() {
  const collab = document.getElementById("collabText");
  splitIntoSpans(collab);               // crea span por letra
  collab.classList.add("shine");        // shine de fondo

  const tl = gsap.timeline();

  tl.from(".intro-sponsor", { duration:0.6, y:30, opacity:0, ease:"power3.out" })
    .from(".intro-logo",    { duration:0.9, scale:0, rotation:180, opacity:0, ease:"back.out(1.6)" }, "-=0.2")
    // letras una por una
    .to("#collabText .ch",  { duration:0.6, opacity:1, y:0, scale:1, ease:"power3.out", stagger:0.035 }, "-=0.3")
    .to("#collabText",      { duration:0.3, className:"+=glow" }, "-=0.2")
    .from(".intro-title",   { duration:0.6, y:40, opacity:0, ease:"power3.out" }, "-=0.2")
    .from(".intro-subtitle",{ duration:0.5, y:28, opacity:0, ease:"power2.out" }, "-=0.3")
    // mantenemos en pantalla un instante y salimos
    .to("#intro", { duration:0.75, opacity:0, scale:0.97, delay:0.9, ease:"power2.inOut",
      onComplete: () => {
        document.getElementById("intro").classList.add("hidden");
        document.getElementById("auth").classList.remove("hidden");
        document.getElementById("header").classList.add("hidden");
        document.getElementById("mainContent").classList.add("hidden");
        document.getElementById("footer").classList.add("hidden");
        gsap.from(".auth-modal",{ duration:0.7, y:20, scale:0.96, opacity:0, ease:"power4.out" });
      }
    });
}

function openSidebar() {
  const sb = document.getElementById("sidebar");
  if (!sb) return;
  sb.classList.remove("hidden");
  sb.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  const sb = document.getElementById("sidebar");
  if (!sb) return;
  sb.classList.remove("active");
  setTimeout(() => sb.classList.add("hidden"), 300);
  document.body.style.overflow = "";
}

// Listeners únicos
document.getElementById("menuToggle")?.addEventListener("click", openSidebar);
document.getElementById("sidebarClose")?.addEventListener("click", closeSidebar);
document.querySelector("#sidebar .sidebar-overlay")?.addEventListener("click", closeSidebar);

// Eventos globales
function bindGlobalEvents() {
  $("#headerRegister")?.addEventListener("click", openAuth);
  $("#login")?.addEventListener("click", handleLogin);
  $("#register")?.addEventListener("click", handleRegister);
  cancelPurchaseBtn?.addEventListener("click", () => toggleModal(purchaseModal,false));
  backToPurchaseBtn?.addEventListener("click", () => { toggleModal(paymentModal,false); toggleModal(purchaseModal,true); });
  toPaymentBtn?.addEventListener("click", proceedToPayment);
  sendWhatsAppBtn?.addEventListener("click", sendVoucherWhatsApp);
}

function openAuth() {
  auth.classList.remove("hidden");
  lockUntilLogin(true);
}

function handleLogin() {
  const user = $("#username").value.trim();
  const pass = $("#password").value.trim();

  if (!user || !pass) return showAuthMsg("Completa usuario y contraseña", "error");

  const exists = users[user];
  if (!exists || exists.password !== pass) return showAuthMsg("Usuario o contraseña inválidos", "error");

  currentUser = user;
  afterSuccessfulLogin();
}

function handleRegister() {
  const user = $("#username").value.trim();
  const pass = $("#password").value.trim();
  if (!user || !pass) return showAuthMsg("Completa usuario y contraseña para registrarte", "error");
  if (users[user]) return showAuthMsg("El usuario ya existe", "error");
  users[user] = { password: pass, balance: 0, level: 1, xp: 0 };
  showAuthMsg("Registro exitoso. Ahora inicia sesión.", "success");
}

function showAuthMsg(text, type) {
  const box = $("#authMessage");
  box.textContent = text;
  box.classList.remove("hidden","success","error");
  box.classList.add(type);
}

// Tras login: mostrar todo y renderizar
function afterSuccessfulLogin() {
  auth.classList.add("hidden");
  header.classList.remove("hidden");
  mainContent.classList.remove("hidden");
  footer.classList.remove("hidden");
  lockUntilLogin(false);

  // Info de usuario en header
  userDisplay.textContent = currentUser;
  userBalance.textContent = users[currentUser]?.balance ?? 0;
  userInfo.classList.remove("hidden");
  guestActions.classList.add("hidden");

  // Renderizar catálogo y animar
  renderAllSections();
  animateMain();
}

// Render general
function renderAllSections() {
  renderSection(webStoreEl, gameDatabase.webStore);
  renderSection(popularEl, gameDatabase.popular);
  renderSection(newEl, gameDatabase.new, true);
  populateGamingSelect();
  attachCardBehaviors();
}

// Render de una sección
function renderSection(container, games, markNew=false) {
  container.innerHTML = games.map(g => cardHTML(g, markNew && g.isNew)).join("");
}

// Card HTML - CON SERVICIOS ESPECÍFICOS
function cardHTML(g, isNew=false) {
  const priceId = "price_" + g.name.toLowerCase().replace(/[^a-z0-9]+/g,"_");
  return `
    <div class="game-card ${isNew ? "new":""}">
      <div class="game-image">
        <img src="${g.imageUrl}" alt="${g.name}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="game-image-placeholder" style="display:none;">🎮</div>
      </div>
      <div class="game-content">
        <h3 class="game-title">${g.name}</h3>
        <p class="game-description">${g.description}</p>
        <div class="game-controls">
          <div class="quantity-group">
            <label class="quantity-label">${g.serviceType}:</label>
            <input type="number" class="quantity-input"
                   data-game="${g.name}"
                   data-id="${g.id}"
                   data-min="${g.min}"
                   data-baseprice="${g.basePrice}"
                   value="${g.min}" min="${g.min}">
          </div>
          <div class="price-display">$<span id="${priceId}">${g.basePrice}</span> ARS</div>
          <button class="buy-button" data-game="${g.name}" data-id="${g.id}">
            <i class="fas fa-bolt"></i> Comprar Ahora
          </button>
        </div>
      </div>
    </div>
  `;
}

// Selección del modal de compra
function populateGamingSelect() {
  const all = [...gameDatabase.webStore, ...gameDatabase.popular, ...gameDatabase.new];
  gameSelectedSel.innerHTML = all.map(g => `<option value="${g.id}">${g.name} (${g.serviceType})</option>`).join("");
}

// Lógica de precio en vivo + abrir modal compra
function attachCardBehaviors() {
  // Actualiza precio cuando cambia cantidad
  $$(".quantity-input").forEach(inp => {
    inp.addEventListener("input", (e) => {
      const el = e.currentTarget;
      const min = Number(el.dataset.min);
      const base = Number(el.dataset.baseprice);
      let qty = Number(el.value || 0);
      if (qty < min) { qty = min; el.value = min; }
      const priceId = "price_" + el.dataset.game.toLowerCase().replace(/[^a-z0-9]+/g,"_");
      const price = Math.round((qty / min) * base);
      const span = document.getElementById(priceId);
      if (span) span.textContent = price;
    });
  });

  // Abrir modal de compra
  $$(".buy-button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.currentTarget.closest(".game-card");
      const inp = card.querySelector(".quantity-input");
      const gameId = inp.dataset.id;
      const gameName = inp.dataset.game;
      const min = Number(inp.dataset.min);
      const base = Number(inp.dataset.baseprice);
      const qty = Math.max(Number(inp.value||min), min);
      const amount = Math.round((qty/min)*base);

      // Prefill modal
      gameSelectedSel.value = gameId;
      amountSelectedInp.value = qty;
      $("#paymentAmount").textContent = amount;

      toggleModal(purchaseModal,true);
    });
  });
}

// Animaciones del main después de render
function animateMain() {
  gsap.from(".banner-card",{ duration:1.0, y:50, opacity:0, ease:"power3.out" });
  const cards = $$(".game-card");
  if (cards.length) {
    gsap.from(cards, { duration:0.8, y:30, opacity:0, stagger:0.08, delay:0.2, ease:"power2.out" });
  }
  gsap.from($$(".section-title"),{ duration:0.6, x:-20, opacity:0, stagger:0.15, delay:0.3, ease:"power2.out" });
  gsap.from(".sponsor-card", { duration:0.8, y:50, opacity:0, stagger:0.1, delay:0.5, ease:"power3.out" });
}

// Modales
function toggleModal(modal, show=true) {
  modal.classList.toggle("hidden", !show);
  document.body.style.overflow = show ? "hidden" : "";
}

// Ir a pago
function proceedToPayment() {
  const selectedId = gameSelectedSel.value;
  const all = [...gameDatabase.webStore, ...gameDatabase.popular, ...gameDatabase.new];
  const g = all.find(x => x.id === selectedId);
  const qty = Math.max(Number(amountSelectedInp.value||g.min), g.min);
  const amount = Math.round((qty / g.min) * g.basePrice);

  $("#paymentAmount").textContent = amount;
  toggleModal(purchaseModal,false);
  toggleModal(paymentModal,true);
}

// Simular envío por WhatsApp
function sendVoucherWhatsApp() {
  const amount = $("#paymentAmount").textContent;
  const msg = encodeURIComponent(`Hola, envié comprobante por ${amount} ARS para mi recarga.`);
  window.open(`https://wa.me/51932460578?text=${msg}`, "_blank");

}