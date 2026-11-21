// ---------- Pricing (the single source of truth for all amounts) ----------
const PRICING = {
  services: {
    standard: { label: 'Standard clean', price: 80 },
    deep: { label: 'Deep clean', price: 140 },
    moveout: { label: 'Move-out clean', price: 200 },
  },
  extraBedroom: 20,
  extraBathroom: 15,
  extras: {
    oven: { label: 'Inside the oven', price: 25 },
    fridge: { label: 'Inside the fridge', price: 20 },
    windows: { label: 'Interior windows', price: 30 },
    laundry: { label: 'Laundry and folding', price: 15 },
  },
  frequencies: {
    once: { label: 'Just once', discount: 0 },
    fortnightly: { label: 'Every two weeks', discount: 0.1 },
    weekly: { label: 'Every week', discount: 0.15 },
  },
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/**
 * Work out the price from the customer's choices.
 * Pure function: same input, same output, no DOM access, so it is easy to test.
 * Amounts are handled in cents to avoid floating-point rounding errors.
 */
function calculateQuote({ service, bedrooms, bathrooms, extras, frequency }) {
  const lines = [];
  const chosenService = PRICING.services[service];
  lines.push({ label: chosenService.label, cents: chosenService.price * 100 });

  const extraBeds = Math.max(0, bedrooms - 1);
  if (extraBeds > 0) {
    lines.push({
      label: `${extraBeds} extra bedroom${extraBeds > 1 ? 's' : ''}`,
      cents: extraBeds * PRICING.extraBedroom * 100,
    });
  }

  const extraBaths = Math.max(0, bathrooms - 1);
  if (extraBaths > 0) {
    lines.push({
      label: `${extraBaths} extra bathroom${extraBaths > 1 ? 's' : ''}`,
      cents: extraBaths * PRICING.extraBathroom * 100,
    });
  }

  for (const key of extras) {
    const extra = PRICING.extras[key];
    if (extra) lines.push({ label: extra.label, cents: extra.price * 100 });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.cents, 0);
  const { discount, label: frequencyLabel } = PRICING.frequencies[frequency];
  const discountCents = Math.round(subtotal * discount);

  return {
    lines,
    subtotal,
    discount: discountCents
      ? { label: `${frequencyLabel} (−${discount * 100}%)`, cents: discountCents }
      : null,
    total: subtotal - discountCents,
  };
}

// ---------- Reading the form and showing the result ----------
const form = document.getElementById('quote-form');
const breakdown = document.getElementById('breakdown');
const totalOutput = document.getElementById('total');
const confirmation = document.getElementById('confirmation');
const confirmationText = document.getElementById('confirmation-text');
const confirmationHeading = document.getElementById('confirmation-heading');
const newQuoteButton = document.getElementById('new-quote');
const dateInput = document.getElementById('date');
const submitButton = form.querySelector('button[type="submit"]');

function readChoices() {
  const data = new FormData(form);
  return {
    service: data.get('service'),
    bedrooms: Number(data.get('bedrooms')),
    bathrooms: Number(data.get('bathrooms')),
    extras: data.getAll('extras'),
    frequency: data.get('frequency'),
  };
}

function breakdownRow(label, text, className) {
  const row = document.createElement('div');
  if (className) row.className = className;
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = label;
  dd.textContent = text;
  row.append(dt, dd);
  return row;
}

function render() {
  const quote = calculateQuote(readChoices());
  const rows = quote.lines.map((line) => breakdownRow(line.label, money.format(line.cents / 100)));
  if (quote.discount) {
    rows.push(breakdownRow(quote.discount.label, `−${money.format(quote.discount.cents / 100)}`, 'is-discount'));
  }
  breakdown.replaceChildren(...rows);

  // <output> is a polite live region, so screen readers hear the new total.
  // Only write it when it changes, so they aren't told the same price twice.
  const totalText = money.format(quote.total / 100);
  if (totalOutput.value !== totalText) totalOutput.value = totalText;
  return quote;
}

// Recalculate whenever a choice changes. render() only updates the total
// when the price actually changes, so editing contact details stays quiet.
form.addEventListener('change', render);

// ---------- Booking date: tomorrow at the earliest ----------
function localISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.min = localISODate(tomorrow);

// ---------- Validation: keep ARIA in sync with :user-invalid ----------
// Based on the Modern Web Guidance "accessible-error-announcement" pattern.
const linkError = (el, shown) => {
  const errorId = el.dataset.error;
  if (!errorId) return;
  const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter((id) => id && id !== errorId);
  if (shown) ids.push(errorId);
  if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
  else el.removeAttribute('aria-describedby');
};

const announcer = document.createElement('div');
announcer.setAttribute('aria-live', 'polite');
announcer.classList.add('visually-hidden');
document.body.append(announcer);
let announceTimer;
let announcedField;

const spokenText = (node) => {
  const copy = node.cloneNode(true);
  copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
  copy.querySelectorAll('[role="img"][aria-label]').forEach((n) => n.replaceWith(`${n.getAttribute('aria-label')}: `));
  return copy.textContent.replace(/\s+/g, ' ').trim();
};

const announceError = (el) => {
  const error = document.getElementById(el.dataset.error);
  if (!error) return;
  const label = el.labels?.[0] ? `${spokenText(el.labels[0])}: ` : '';
  clearTimeout(announceTimer);
  announcer.textContent = '';
  announcedField = el;
  announceTimer = setTimeout(() => {
    announcer.textContent = label + spokenText(error);
  }, 500);
};

const flagged = new WeakSet();
const announced = new WeakSet();
const syncAria = (el, announce = false) => {
  if (!el.matches?.('input, select, textarea')) return;
  const invalid = el.matches(':user-invalid');
  if (invalid) {
    if (announce && !announced.has(el)) {
      announceError(el);
      announced.add(el);
    }
    el.setAttribute('aria-invalid', 'true');
    linkError(el, true);
    flagged.add(el);
  } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
    el.setAttribute('aria-invalid', 'false');
    linkError(el, false);
    flagged.delete(el);
    announced.delete(el);
    if (announcedField === el) {
      clearTimeout(announceTimer);
      announcer.textContent = '';
    }
  }
};

form.querySelectorAll('input, select, textarea').forEach((el) => syncAria(el));
form.addEventListener('blur', (e) => syncAria(e.target, true), true);
form.addEventListener('input', (e) => {
  if (e.target.hasAttribute('aria-invalid')) syncAria(e.target);
});
form.addEventListener('change', (e) => syncAria(e.target, true), true);
form.addEventListener('invalid', (e) => {
  announced.add(e.target);
  syncAria(e.target);
}, true);
form.addEventListener('reset', () => {
  setTimeout(() => {
    [...form.elements].forEach((el) => syncAria(el));
    render();
  });
});

// ---------- Submitting the request ----------
// The browser's own validation runs first: if a required field is empty or wrong,
// 'submit' never fires and focus moves to the first problem field.
form.addEventListener('submit', (event) => {
  event.preventDefault();
  submitButton.disabled = true; // stop double submissions

  const quote = render();
  const data = new FormData(form);
  const name = data.get('full_name').trim().split(/\s+/)[0];
  const date = new Date(`${data.get('date')}T00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // In a real project this is where the data would be sent, e.g.
  // fetch('/api/quote', { method: 'POST', body: data })
  confirmationText.textContent =
    `Thanks, ${name}. We'll email ${data.get('email')} within one working day to confirm ` +
    `your ${money.format(quote.total / 100)} clean on ${date}.`;

  form.hidden = true;
  confirmation.hidden = false;
  confirmationHeading.focus();
});

newQuoteButton.addEventListener('click', () => {
  form.reset();
  submitButton.disabled = false;
  confirmation.hidden = true;
  form.hidden = false;
  document.querySelector('h1').scrollIntoView();
  form.querySelector('input').focus();
});

render();
