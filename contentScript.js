// contentScript.js — complete safe version (scoring + Rolex badge + defensive messaging)
(function () {
  /************************************************************************
   * DOM parsers (Amazon + Flipkart)
   ************************************************************************/
  function getAmazonTitle() {
    const el = document.querySelector('#productTitle');
    return el ? el.innerText.trim() : null;
  }

  function getFlipkartTitle() {
    const el =
      document.querySelector('span.B_NuCI') ||
      document.querySelector('span._35KyD6');
    return el ? el.innerText.trim() : null;
  }

  function getPageText() {
    const title = getAmazonTitle() || getFlipkartTitle() || '';
    const bullets = Array.from(document.querySelectorAll('#feature-bullets li'))
      .map((li) => li.innerText)
      .join(' ');
    const descMeta = document.querySelector('#productDescription') || document.querySelector('#description');
    const desc = descMeta ? descMeta.innerText : '';
    return (title + ' ' + bullets + ' ' + desc).trim();
  }

  /************************************************************************
   * Scoring engine (rule-based)
   ************************************************************************/
  function computeScoreFromText(text) {
    const lower = (text || '').toLowerCase();
    let score = 60; // baseline
    const breakdown = [];

    const apply = (delta, rule, reason) => {
      score += delta;
      breakdown.push({ rule, delta, reason });
    };

    if (/\bplastic\b|\bpoly\b|\bpvc\b/.test(lower)) apply(-20, 'material_plastic', 'Contains plastic keywords');
    if (/\bglass\b|\brecycled\b/.test(lower)) apply(+10, 'material_recycled_glass', 'Contains glass or recycled keywords');
    if (/\brefill\b|\bbulk\b|\bconcentrate\b/.test(lower)) apply(+15, 'packaging_refill_bulk', 'Refill/bulk/concentrate');
    if (/\bdisposable\b|\bsingle-use\b|\bonce\b/.test(lower)) apply(-25, 'disposable', 'Disposable / single-use product');
    if (/\belectronics\b|\bsmartphone\b|\blaptop\b|\bcharger\b/.test(lower)) apply(-10, 'electronics', 'Electronics typically higher carbon footprint');
    if (/\borganic\b|\bfair trade\b|\bcertified\b|\bcertification\b/.test(lower)) apply(+15, 'organic_certified', 'Organic / certified signals');
    if (/\bmade in\b|\bassembled in\b/.test(lower)) apply(-5, 'global_origin', 'Made in / assembled in (possible long shipping)');
    if (/\bfast fashion\b|\bcheap\b|\btrendy\b|\bmass-produced\b/.test(lower)) apply(-15, 'fast_fashion', 'Fast-fashion indicators');
    if (/\brecyclable\b|\brecyclability\b|\brecyclable packaging\b/.test(lower)) apply(+10, 'recyclable', 'Recyclable packaging indicated');

    score = Math.max(0, Math.min(100, Math.round(score)));
    return { score, breakdown };
  }

  /************************************************************************
   * Storage helper (save under two keys for compatibility)
   ************************************************************************/
  function saveLastProduct(product) {
    try {
      // store under both keys so popup code reading either will find it
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local && typeof chrome.storage.local.set === 'function') {
        chrome.storage.local.set({ lastProduct: product, eco_lastProduct: product }, () => {
          // callback after save
          try {
            console.log('EcoFindr: saved product to chrome.storage.local', product);
          } catch (e) { /* ignore */ }
        });
        return;
      }
    } catch (e) {
      // fall through to localStorage fallback
    }

    try {
      localStorage.setItem('lastProduct', JSON.stringify(product));
      localStorage.setItem('eco_lastProduct', JSON.stringify(product));
      console.warn('EcoFindr: chrome.storage unavailable — saved to localStorage instead');
    } catch (e2) {
      console.error('EcoFindr: failed to save product data', e2);
    }
  }

  /************************************************************************
   * Badge creation & management (Rolex theme, robust)
   ************************************************************************/
  function createBadge(score) {
    const existing = document.getElementById('ecofindr-badge');
    if (existing) return existing;

    const badge = document.createElement('button');
    badge.id = 'ecofindr-badge';
    badge.setAttribute('aria-label', 'Open EcoFindr details');
    badge.title = `EcoScore: ${score} — Click for breakdown`;

    // Rolex theme
    const bg = '#0b6634';
    const gold = '#d4af37';

    Object.assign(badge.style, {
      position: 'fixed',
      right: '14px',
      top: '14px',
      zIndex: 2147483647,
      background: bg,
      color: gold,
      border: `2px solid ${gold}`,
      padding: '8px 14px',
      borderRadius: '22px',
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: '14px',
      fontWeight: '600',
      letterSpacing: '0.3px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.28)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      pointerEvents: 'auto'
    });

    // gold dot
    const dot = document.createElement('span');
    Object.assign(dot.style, {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: gold,
      display: 'inline-block'
    });

    const label = document.createElement('span');
    label.textContent = `EcoScore: ${score}`;
    label.style.color = gold;

    badge.appendChild(dot);
    badge.appendChild(label);

    // defensive click handler: check chrome.runtime first
    badge.addEventListener('click', () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.sendMessage === 'function') {
          chrome.runtime.sendMessage({ action: 'openPopup' });
          return;
        }
      } catch (e) {
        console.warn('EcoFindr: chrome.runtime unavailable', e);
      }

      // fallback: postMessage to page (non-privileged)
      try {
        window.postMessage({ source: 'ecofindr', action: 'openPopupFallback' }, '*');
        console.warn('EcoFindr: used fallback postMessage to request popup (check background).');
      } catch (e) {
        console.warn('EcoFindr: fallback postMessage failed', e);
      }
    });

    // append to body (safer on many sites)
    try {
      (document.body || document.documentElement).appendChild(badge);
    } catch (e) {
      console.error('EcoFindr: failed to append badge', e);
    }

    return badge;
  }

  function updateBadge(score) {
    let b = document.getElementById('ecofindr-badge');
    if (!b) return createBadge(score);

    const gold = '#d4af37';
    b.title = `EcoScore: ${score} — Click for breakdown`;

    const label = b.querySelector('span:nth-child(2)');
    if (label) label.textContent = `EcoScore: ${score}`;

    const bg = score >= 70 ? '#154b2d' : score >= 40 ? '#6b5e20' : '#5a1f1f';
    b.style.background = bg;
    b.style.border = `2px solid ${gold}`;

    const dot = b.querySelector('span:nth-child(1)');
    if (dot) dot.style.background = gold;
  }

  /************************************************************************
   * Main flow
   ************************************************************************/
  try {
    const title = getAmazonTitle() || getFlipkartTitle();
    const pageText = getPageText();

    if (title) {
      const { score, breakdown } = computeScoreFromText(pageText || title);
      const product = { title, url: location.href, ts: Date.now(), score, breakdown };

      console.log('EcoFindr content script active! Parsed title:', title);
      console.log('EcoFindr computed score:', score);
      console.table(breakdown);

      // save and show badge
      saveLastProduct(product);
      updateBadge(score);
    } else {
      console.log('EcoFindr: No product title detected on this page.');
    }
  } catch (err) {
    console.error('EcoFindr runtime error:', err);
  }

  /************************************************************************
   * Debug: listen for fallback messages from page (optional helper)
   * Background/service worker can relay if needed.
   ************************************************************************/
  window.addEventListener('message', (event) => {
    if (!event || !event.data) return;
    if (event.data && event.data.source === 'ecofindr' && event.data.action === 'openPopupFallback') {
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.sendMessage === 'function') {
          chrome.runtime.sendMessage({ action: 'openPopup' });
        }
      } catch (e) {
        // ignore
      }
    }
  });
})();
