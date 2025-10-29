
const SERVICES = [{"name": "Limpieza general del hogar", "category": "Limpieza", "description": "Servicio de limpieza regular para casa o departamento.", "price_mxn": 350}, {"name": "Limpieza profunda", "category": "Limpieza", "description": "Limpieza detallada ideal para mudanzas o temporada.", "price_mxn": 860}, {"name": "Plomería básica", "category": "Plomería", "description": "Reparaciones menores de fugas y conexiones.", "price_mxn": 600}];
const state = { q: "", category: "all", selected: null, tz: "America/Monterrey" };
const WHATSAPP_NUMBER = "5218112345678"; // Cambia por tu número (formato internacional sin +)

function categories() {
  const set = new Set(SERVICES.map(s => s.category || "Otros"));
  return ["all", ...Array.from(set)];
}
function money(v) {
  try { return typeof v === "number" ? new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(v) : "Pide cotización"; }
  catch(e) { return typeof v === "number" ? "MXN $" + Math.round(v) : "Pide cotización"; }
}

function renderSidebar() {
  const wrap = document.getElementById("sidebar");
  const cats = categories();
  wrap.innerHTML = '<div class="side-list" role="navigation" aria-label="Categorías"></div>';
  const list = wrap.querySelector(".side-list");
  cats.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = (c === "all" ? "Todas las categorías" : c);
    if (state.category === c) btn.classList.add("active");
    btn.addEventListener("click", () => { state.category = c; renderCards(); renderSidebar(); });
    list.appendChild(btn);
  });
}

function renderCards() {
  const q = state.q.trim().toLowerCase();
  const filtered = SERVICES.filter(s => {
    const matchesQ = !q || (String(s.name + " " + (s.description||"")).toLowerCase().includes(q));
    const matchesCat = state.category === "all" || (s.category || "Otros") === state.category;
    return matchesQ && matchesCat;
  });

  const cards = document.getElementById("cards");
  cards.innerHTML = filtered.map((s,i) => `
    <div class="card" aria-label="Servicio \${s.name}">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px">
        <div>
          <div style="font-weight:700">\${s.name}</div>
          <div class="muted" style="font-size:13px">\${s.category || "Otros"}</div>
        </div>
        <span class="pill">\${money(s.price_mxn)}</span>
      </div>
      <div class="muted" style="min-height:42px">\${s.description || ""}</div>
      <div style="display:flex;justify-content:flex-end;gap:8px">
        <button class="btn" data-idx="\${i}">Reservar</button>
        <a class="btn btn-outline" href="#" data-wa="\${i}">WhatsApp</a>
      </div>
    </div>
  `).join("");

  // acciones
  Array.from(cards.querySelectorAll("button.btn")).forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = Number(e.target.getAttribute("data-idx"));
      openModal(filtered[idx]);
    });
  });
  Array.from(cards.querySelectorAll("a[data-wa]")).forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const idx = Number(a.getAttribute("data-wa"));
      openWhatsApp(filtered[idx]);
    });
  });
}

function openModal(s) {
  state.selected = s;
  document.getElementById("modal-title").textContent = "Reservar — " + s.name;
  document.getElementById("modal-subtitle").textContent = money(s.price_mxn);
  document.getElementById("date").value = new Date().toISOString().slice(0,10);
  document.getElementById("modal").classList.add("open");
}
function closeModal() { document.getElementById("modal").classList.remove("open"); }

function openWhatsApp(s) {
  const text = `Hola, me interesa el servicio: \${s.name}.\nCategoría: \${s.category || 'Otros'}\nPrecio: \${money(s.price_mxn)}\n¿Hay disponibilidad esta semana?`;
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}

function confirmBooking() {
  const s = state.selected; if (!s) return;
  const order = {
    id: Math.random().toString(36).slice(2, 10).toUpperCase(),
    service: s.name,
    price_mxn: (typeof s.price_mxn === "number" ? s.price_mxn : null),
    when: document.getElementById("date").value + " " + document.getElementById("time").value,
    customer: {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      address: document.getElementById("address").value.trim(),
    },
    notes: document.getElementById("notes").value.trim(),
    created_at: new Date().toISOString(),
    timezone: state.tz,
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(order, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", "pedido_" + order.id + ".json");
  document.body.appendChild(a); a.click(); a.remove();
  closeModal();
  alert("¡Reserva creada! Pedido " + order.id);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = String(new Date().getFullYear());
  document.getElementById("search").addEventListener("input", e => { state.q = e.target.value; renderCards(); });
  document.getElementById("btn-buscar").addEventListener("click", renderCards);
  document.getElementById("category").addEventListener("change", e => { state.category = e.target.value; renderCards(); });
  document.getElementById("btn-cancel").addEventListener("click", closeModal);
  document.getElementById("btn-confirm").addEventListener("click", confirmBooking);
  document.getElementById("modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
  renderSidebar(); renderCards();

  // Floating WA
  const wa = document.getElementById("wa-float");
  if (wa) {
    wa.addEventListener("click", e => {
      e.preventDefault();
      const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hola, me interesa un servicio de Hogarix.");
      window.open(url, "_blank");
    });
  }
});
