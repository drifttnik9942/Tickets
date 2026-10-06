const dateInput = document.getElementById('dateInput');
const generateSingleBtn = document.getElementById('generateSingle');
const generateWeekBtn = document.getElementById('generateWeek');
const ticketContainer = document.getElementById('ticketContainer');
const ticketTemplate = document.getElementById('ticketTemplate');

// Format date en "MMM DD, YYYY" (ex: OCT 02, 2026)
function formatDateLong(date) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// Format date en "Mmm DD, YYYY" pour la section reçu (ex: Oct 02, 2026)
function formatDateShort(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// Format date d'achat (toujours 06:50am)
function formatPurchaseTime(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `06:50am ${month} ${day}, ${year}`;
}

function createTicket(date) {
  const clone = ticketTemplate.content.cloneNode(true);
  
  const expDateLong = formatDateLong(date);
  const expDateShort = formatDateShort(date);
  const purchaseDateTime = formatPurchaseTime(date);

  // Section du haut
  clone.querySelector('.exp-date').textContent = expDateLong;
  clone.querySelector('.purchase-datetime').textContent = purchaseDateTime;

  // Section du bas (Reçu)
  clone.querySelector('.exp-date-short').textContent = expDateShort;
  clone.querySelector('.exp-date-short-2').textContent = expDateShort;

  return clone;
}

function renderTickets(dates) {
  ticketContainer.innerHTML = '';
  dates.forEach(date => {
    ticketContainer.appendChild(createTicket(date));
  });
}

function getSelectedDate() {
  const val = dateInput.value;
  if (!val) return null;
  const [year, month, day] = val.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Écouteurs d'événements
generateSingleBtn.addEventListener('click', () => {
  const date = getSelectedDate();
  if (!date) return alert('Veuillez sélectionner une date.');
  renderTickets([date]);
});

generateWeekBtn.addEventListener('click', () => {
  const startDate = getSelectedDate();
  if (!startDate) return alert('Veuillez sélectionner une date de début.');

  const dates = [];
  const current = new Date(startDate);

  // Trouver le lundi de la semaine
  const dayOfWeek = current.getDay(); // 0 = Dimanche, 1 = Lundi...
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
  current.setDate(current.getDate() + diffToMonday);

  // Générer du Lundi au Vendredi (5 jours)
  for (let i = 0; i < 5; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  renderTickets(dates);
});

// Définir la date par défaut sur aujourd'hui
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
dateInput.value = `${yyyy}-${mm}-${dd}`;

// Rendu initial
renderTickets([today]);

// ==========================================
// ENREGISTREMENT DU SERVICE WORKER (PWA)
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker enregistré avec succès:', registration.scope);
      })
      .catch(err => {
        console.log('Échec de l\'enregistrement du ServiceWorker:', err);
      });
  });
}