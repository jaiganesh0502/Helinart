/**
 * HELINART — Full-Width Luxury Platform Controller
 * Handles WAI-ARIA Top Navigation Tab Switching, Mobile Menu Drawer, View Transitions,
 * Live Price Calculator, Dynamic Appointment Scheduling, Favourites Moodboard, and Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. STATE & DATA STORE
  // =========================================================================
  const state = {
    activeTab: 'dashboard',
    favourites: [
      {
        id: 'sakura-velvet',
        title: 'Sakura Velvet Chrome',
        price: 1099,
        time: '75 mins',
        shape: 'Almond',
        style: 'Chrome',
        img: 'assets/images/design-sakura-chrome.jpg'
      },
      {
        id: 'crystal-french',
        title: 'Crystal Micro-French',
        price: 1299,
        time: '90 mins',
        shape: 'Coffin',
        style: 'Luxury',
        img: 'assets/images/design-crystal-french.jpg'
      },
      {
        id: 'vanilla-french',
        title: 'Vanilla Glaze French',
        price: 799,
        time: '60 mins',
        shape: 'Square',
        style: 'French',
        img: 'assets/images/design-vanilla-glaze.jpg'
      }
    ],
    selectedDate: 'Today, Sep 01',
    selectedTime: '10:00 AM',
    selectedArtist: 'Sarah Lawrence',
    selectedService: 'Gel Extension + Chrome Art',
    selectedPrice: 1199
  };

  // =========================================================================
  // 2. TOAST NOTIFICATION UTILITY
  // =========================================================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'info', duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    toast.innerHTML = `
      <span style="color:var(--dusty-rose); font-size:16px;">✨</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 400);
    }, duration);
  }

  // =========================================================================
  // 3. TOP NAVIGATION TAB SYSTEM (W3C ARIA & VIEW TRANSITIONS)
  // =========================================================================
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle-btn');

  function switchTab(targetTabId, updateHash = true) {
    const targetLinks = document.querySelectorAll(`.nav-link[data-tab="${targetTabId}"]`);
    const targetPanel = document.getElementById(`panel-${targetTabId}`);

    if (!targetPanel) return;

    const executeDOMUpdate = () => {
      // 1. Update Navigation Links
      navLinks.forEach(link => {
        const isCurrent = link.getAttribute('data-tab') === targetTabId;
        link.classList.toggle('active', isCurrent);
        link.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      // 2. Update Tab Panels
      tabPanels.forEach(panel => {
        const isCurrent = panel === targetPanel;
        panel.classList.toggle('active', isCurrent);
        panel.hidden = !isCurrent;
      });

      state.activeTab = targetTabId;

      // Close mobile drawer if open
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
      }

      // Render tab-specific views
      if (targetTabId === 'favourites') {
        renderFavourites();
      }

      // Smooth scroll to top of viewport
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Modern View Transitions API with seamless fallback
    if (document.startViewTransition) {
      const transition = document.startViewTransition(executeDOMUpdate);
      transition.finished.finally(() => {
        targetPanel.focus({ preventScroll: true });
      });
    } else {
      executeDOMUpdate();
      targetPanel.focus({ preventScroll: true });
    }

    // Sync URL hash for bookmarking & history
    if (updateHash) {
      history.pushState(null, '', `#${targetTabId}`);
    }
  }

  // Nav link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
  }

  // URL Hash on Initial Load & Popstate
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`panel-${hash}`)) {
      switchTab(hash, false);
    } else {
      switchTab('dashboard', false);
    }
  }

  window.addEventListener('popstate', handleHashChange);

  // Quick Action Buttons on Dashboard
  document.getElementById('hero-book-btn')?.addEventListener('click', () => switchTab('booking'));
  document.getElementById('hero-explore-btn')?.addEventListener('click', () => switchTab('designs'));
  document.getElementById('bridal-campaign-btn')?.addEventListener('click', () => switchTab('services'));
  document.getElementById('header-fav-btn')?.addEventListener('click', () => switchTab('favourites'));

  // Quick service cards shortcuts
  document.querySelectorAll('.service-visual-card[data-service]').forEach(chip => {
    chip.addEventListener('click', () => {
      switchTab('services');
      showToast('Switched to Service Menu & Price Calculator', 'info', 1800);
    });
  });

  // =========================================================================
  // 4. LIVE INTERACTIVE PRICE CALCULATOR
  // =========================================================================
  const calcBaseSelect = document.getElementById('calc-base-service');
  const calcLengthSelect = document.getElementById('calc-length');
  const calcAddons = document.querySelectorAll('.calc-addon');
  const calcTotalDisplay = document.getElementById('calc-total-display');
  const calcSummaryText = document.getElementById('calc-summary-text');
  const bookCalcSetBtn = document.getElementById('book-calc-set-btn');

  function calculatePrice() {
    if (!calcBaseSelect || !calcLengthSelect || !calcTotalDisplay) return;

    const baseVal = parseInt(calcBaseSelect.value, 10) || 799;
    const baseName = calcBaseSelect.options[calcBaseSelect.selectedIndex].getAttribute('data-name');

    const lengthVal = parseInt(calcLengthSelect.value, 10) || 0;
    const lengthName = calcLengthSelect.options[calcLengthSelect.selectedIndex].getAttribute('data-name');

    let addonsTotal = 0;
    const selectedAddonNames = [];

    calcAddons.forEach(addon => {
      if (addon.checked) {
        addonsTotal += parseInt(addon.value, 10);
        selectedAddonNames.push(addon.getAttribute('data-name'));
      }
    });

    const grandTotal = baseVal + lengthVal + addonsTotal;
    calcTotalDisplay.textContent = `₹${grandTotal.toLocaleString()}`;

    let summaryParts = [baseName];
    if (lengthVal > 0) summaryParts.push(lengthName);
    if (selectedAddonNames.length > 0) summaryParts.push(selectedAddonNames.slice(0, 2).join(' + '));

    if (calcSummaryText) calcSummaryText.textContent = summaryParts.join(' • ');

    return {
      title: `${baseName} (${lengthName})`,
      price: grandTotal,
      summary: summaryParts.join(' • ')
    };
  }

  if (calcBaseSelect) calcBaseSelect.addEventListener('change', calculatePrice);
  if (calcLengthSelect) calcLengthSelect.addEventListener('change', calculatePrice);
  calcAddons.forEach(chk => chk.addEventListener('change', calculatePrice));

  if (bookCalcSetBtn) {
    bookCalcSetBtn.addEventListener('click', () => {
      const calcData = calculatePrice();
      const bookingServiceSelect = document.getElementById('booking-service-select');
      if (bookingServiceSelect) {
        let customOpt = bookingServiceSelect.querySelector('option[data-custom="true"]');
        if (!customOpt) {
          customOpt = document.createElement('option');
          customOpt.setAttribute('data-custom', 'true');
          bookingServiceSelect.prepend(customOpt);
        }
        customOpt.value = `Custom Set: ${calcData.title}`;
        customOpt.textContent = `Custom Set: ${calcData.title} (₹${calcData.price})`;
        customOpt.setAttribute('data-price', calcData.price);
        bookingServiceSelect.value = customOpt.value;

        updateBookingSummary();
      }

      switchTab('booking');
      showToast(`Custom set configured for ₹${calcData.price}! Select your time slot.`, 'success');
    });
  }

  // =========================================================================
  // 5. FAVOURITES MOODBOARD (SAVE / UNSAVE WITH INSTAGRAM-STYLE LUXURY ANIMATION)
  // =========================================================================
  const headerFavBadge = document.getElementById('header-fav-badge');
  const favouritesGrid = document.getElementById('favourites-list-grid');

  function getHeartSvg() {
    return `<svg class="heart-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path class="heart-path" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  }

  function triggerHeartPop(imageContainer) {
    if (!imageContainer) return;
    const oldOverlay = imageContainer.querySelector('.like-pop-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.className = 'like-pop-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="like-pop-particles">
        <span class="like-particle p-1"></span>
        <span class="like-particle p-2"></span>
        <span class="like-particle p-3"></span>
        <span class="like-particle p-4"></span>
        <span class="like-particle p-5"></span>
        <span class="like-particle p-6"></span>
      </div>
      <svg class="like-pop-heart" viewBox="0 0 24 24" width="80" height="80">
        <defs>
          <linearGradient id="helinartHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D9A29C" />
            <stop offset="55%" stop-color="#C98F8A" />
            <stop offset="100%" stop-color="#B77F7B" />
          </linearGradient>
        </defs>
        <path fill="url(#helinartHeartGrad)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;
    imageContainer.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
    }, 760);
  }

  function updateFavBadges() {
    const count = state.favourites.length;
    if (headerFavBadge) {
      headerFavBadge.textContent = count;
      headerFavBadge.classList.remove('counter-pop');
      void headerFavBadge.offsetWidth;
      headerFavBadge.classList.add('counter-pop');
    }
  }

  function renderFavourites() {
    if (!favouritesGrid) return;

    if (state.favourites.length === 0) {
      favouritesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:4rem 1rem; background:var(--cream); border-radius:var(--radius-lg); border:1px dashed var(--rose-border);">
          <div style="font-size:3rem; margin-bottom:1rem;">🤍</div>
          <h3 style="margin-bottom:0.5rem;">Your collection is empty</h3>
          <p class="secondary-text" style="margin-bottom:1.5rem;">Explore the trending gallery and tap ❤️ on looks you love!</p>
          <button class="button-primary" onclick="document.querySelector('.nav-link[data-tab=designs]').click()">Explore Designs</button>
        </div>
      `;
      return;
    }

    favouritesGrid.innerHTML = state.favourites.map(item => `
      <div class="design-card">
        <div class="design-image-container">
          <img src="${item.img || 'assets/images/design-sakura-chrome.jpg'}" alt="${item.title}">
          <button class="design-fav-btn active" data-design="${item.id}" data-id="${item.id}" aria-label="Remove ${item.title} from favourites" aria-pressed="true" title="Remove from Favourites">${getHeartSvg()}</button>
        </div>
        <div class="design-details">
          <div>
            <div class="design-tag-wrap">
              <span class="design-tag-badge">${item.shape}</span>
              <span class="design-tag-badge">${item.style}</span>
            </div>
            <div class="card-title" style="margin-top:4px;">${item.title}</div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="rating-value"><span class="rating-star">★</span> 4.9</span>
            <span class="price">₹${item.price.toLocaleString()}</span>
          </div>
          <button class="button-primary btn-compact quick-book-design-btn" data-title="${item.title}" data-price="${item.price}" style="width:100%;">Book This Look</button>
        </div>
      </div>
    `).join('');

    attachDesignCardListeners();
    attachQuickBookListeners();
  }

  function toggleFavourite(id, title = '', price = 999, shape = 'Almond', style = 'Chrome', img = 'assets/images/design-sakura-chrome.jpg', options = {}) {
    const forceAdd = options.forceAdd || false;
    const existingIndex = state.favourites.findIndex(f => f.id === id);
    const isCurrentlyFav = existingIndex > -1;

    if (isCurrentlyFav && !forceAdd) {
      state.favourites.splice(existingIndex, 1);
      showToast('Removed look from your Favourites collection', 'info', 1800);
    } else if (!isCurrentlyFav) {
      state.favourites.push({ id, title, price, shape, style, img, time: '75 mins' });
      showToast(`Saved "${title}" to your Favourites!`, 'success', 2200);
    }

    const isFav = state.favourites.some(f => f.id === id);

    document.querySelectorAll(`.design-fav-btn[data-design="${id}"], .design-fav-btn[data-id="${id}"]`).forEach(btn => {
      btn.classList.toggle('active', isFav);
      btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
      btn.setAttribute('aria-label', isFav ? `Remove ${title || 'look'} from favourites` : `Add ${title || 'look'} to favourites`);
      btn.setAttribute('title', isFav ? 'Remove from Favourites' : 'Save to Favourites');

      btn.classList.remove('btn-animate');
      void btn.offsetWidth;
      btn.classList.add('btn-animate');

      if (isFav && (options.triggerPop !== false || forceAdd)) {
        const card = btn.closest('.design-card');
        const imgContainer = card ? card.querySelector('.design-image-container') : null;
        if (imgContainer) {
          triggerHeartPop(imgContainer);
        }
      }
    });

    updateFavBadges();
    if (state.activeTab === 'favourites') {
      renderFavourites();
    }
  }

  function attachDesignCardListeners() {
    document.querySelectorAll('.design-card').forEach(card => {
      const imgContainer = card.querySelector('.design-image-container');
      const favBtn = card.querySelector('.design-fav-btn');
      if (!imgContainer || !favBtn) return;

      if (!imgContainer.hasAttribute('data-fav-attached')) {
        imgContainer.setAttribute('data-fav-attached', 'true');

        // Desktop Double Click on image
        imgContainer.addEventListener('dblclick', (e) => {
          e.preventDefault();
          const designId = favBtn.getAttribute('data-design') || favBtn.getAttribute('data-id');
          const title = card.querySelector('.card-title')?.textContent.trim() || 'Nail Design';
          const priceText = card.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || '999';
          const img = imgContainer.querySelector('img')?.getAttribute('src') || 'assets/images/design-sakura-chrome.jpg';

          toggleFavourite(designId, title, parseInt(priceText, 10), 'Almond', 'Luxury', img, { forceAdd: true, triggerPop: true });
        });

        // Mobile Double Tap detection
        let lastTap = 0;
        imgContainer.addEventListener('touchend', (e) => {
          const currentTime = new Date().getTime();
          const tapLength = currentTime - lastTap;
          if (tapLength < 340 && tapLength > 0) {
            e.preventDefault();
            const designId = favBtn.getAttribute('data-design') || favBtn.getAttribute('data-id');
            const title = card.querySelector('.card-title')?.textContent.trim() || 'Nail Design';
            const priceText = card.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || '999';
            const img = imgContainer.querySelector('img')?.getAttribute('src') || 'assets/images/design-sakura-chrome.jpg';

            toggleFavourite(designId, title, parseInt(priceText, 10), 'Almond', 'Luxury', img, { forceAdd: true, triggerPop: true });
          }
          lastTap = currentTime;
        }, { passive: false });
      }
    });
  }

  // Delegated single click handler for all favourite buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.design-fav-btn');
    if (!btn) return;
    e.stopPropagation();

    const designId = btn.getAttribute('data-design') || btn.getAttribute('data-id');
    const card = btn.closest('.design-card');
    const title = card ? card.querySelector('.card-title')?.textContent.trim() : 'Nail Design';
    const priceText = card ? card.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') : '999';
    const img = card ? card.querySelector('.design-image-container img')?.getAttribute('src') : 'assets/images/design-sakura-chrome.jpg';

    toggleFavourite(designId, title, parseInt(priceText, 10), 'Almond', 'Luxury', img, { triggerPop: true });
  });

  // Attach listeners to initial static cards on page load
  attachDesignCardListeners();

  // Populate initial SVG icons for static buttons if needed
  document.querySelectorAll('.design-fav-btn').forEach(btn => {
    if (!btn.querySelector('svg')) {
      const isFav = btn.classList.contains('active');
      btn.innerHTML = getHeartSvg();
      btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
      btn.setAttribute('aria-label', isFav ? 'Remove from favourites' : 'Add to favourites');
    }
  });

  document.getElementById('clear-favs-btn')?.addEventListener('click', () => {
    state.favourites = [];
    updateFavBadges();
    renderFavourites();
    document.querySelectorAll('.design-fav-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Add to favourites');
    });
    showToast('Cleared all saved favorites', 'info', 1800);
  });

  // =========================================================================
  // 6. APPOINTMENT BOOKING WIZARD & SLOT ENGINE
  // =========================================================================
  const bookingServiceSelect = document.getElementById('booking-service-select');
  const datePillBtns = document.querySelectorAll('.date-pill-btn');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn:not(.booked)');
  const bookingSummaryDisplay = document.getElementById('booking-live-summary');
  const bookingPriceDisplay = document.getElementById('booking-total-price');
  const bookingForm = document.getElementById('appointment-booking-form');

  function updateBookingSummary() {
    if (!bookingServiceSelect || !bookingSummaryDisplay) return;

    const opt = bookingServiceSelect.options[bookingServiceSelect.selectedIndex];
    const serviceName = opt ? opt.value : 'Gel Extension';
    const price = opt ? opt.getAttribute('data-price') || '1199' : '1199';

    const selectedArtistRadio = document.querySelector('input[name="booking-artist"]:checked');
    const artistName = selectedArtistRadio ? selectedArtistRadio.value : 'Sarah Lawrence';

    state.selectedService = serviceName;
    state.selectedArtist = artistName;
    state.selectedPrice = parseInt(price, 10);

    bookingSummaryDisplay.textContent = `${artistName} • ${state.selectedDate} at ${state.selectedTime}`;
    if (bookingPriceDisplay) bookingPriceDisplay.textContent = `₹${state.selectedPrice.toLocaleString()}`;
  }

  if (bookingServiceSelect) bookingServiceSelect.addEventListener('change', updateBookingSummary);
  document.querySelectorAll('input[name="booking-artist"]').forEach(r => r.addEventListener('change', updateBookingSummary));

  datePillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      datePillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedDate = btn.getAttribute('data-date');
      updateBookingSummary();
    });
  });

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedTime = btn.getAttribute('data-time');
      updateBookingSummary();
    });
  });

  function attachQuickBookListeners() {
    document.querySelectorAll('.quick-book-design-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title') || 'Custom Look';
        const price = btn.getAttribute('data-price') || '1099';

        if (bookingServiceSelect) {
          let customOpt = bookingServiceSelect.querySelector('option[data-design-opt="true"]');
          if (!customOpt) {
            customOpt = document.createElement('option');
            customOpt.setAttribute('data-design-opt', 'true');
            bookingServiceSelect.prepend(customOpt);
          }
          customOpt.value = title;
          customOpt.textContent = `${title} (₹${price})`;
          customOpt.setAttribute('data-price', price);
          bookingServiceSelect.value = title;
          updateBookingSummary();
        }

        switchTab('booking');
        showToast(`Selected "${title}". Pick your preferred time slot!`, 'success');
      });
    });
  }
  attachQuickBookListeners();

  document.querySelectorAll('.book-with-artist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const artist = btn.getAttribute('data-artist');
      const radio = document.querySelector(`input[name="booking-artist"][value="${artist}"]`);
      if (radio) {
        radio.checked = true;
        updateBookingSummary();
      }
      switchTab('booking');
      showToast(`Selected stylist: ${artist}. Choose your appointment time.`, 'info');
    });
  });

  // Booking Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newBooking = {
        service: state.selectedService,
        artist: state.selectedArtist,
        date: state.selectedDate,
        time: state.selectedTime,
        price: state.selectedPrice,
        status: 'Confirmed'
      };

      const upcomingList = document.getElementById('upcoming-appointments-list');
      if (upcomingList) {
        const newCard = document.createElement('div');
        newCard.className = 'appointment-horizontal-card';
        newCard.innerHTML = `
          <div style="display:flex; align-items:center; gap:var(--space-4);">
            <div class="appointment-date-block">
              <span class="day">01</span>
              <span class="month">SEP</span>
            </div>
            <div>
              <span class="status-confirmed">Confirmed</span>
              <div class="card-title" style="font-size:17px; margin-top:4px;">${newBooking.service}</div>
              <div class="secondary-text">Artist: ${newBooking.artist} • ${newBooking.time} (${newBooking.date})</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:var(--space-3);">
            <span class="price" style="font-size:20px;">₹${newBooking.price.toLocaleString()}</span>
            <button class="button-secondary btn-compact" onclick="alert('Reschedule request submitted to Helinart concierge!')">Reschedule</button>
            <button class="button-secondary btn-compact" style="color:#9B6260;" onclick="this.closest('.appointment-horizontal-card').remove(); alert('Appointment cancelled.');">Cancel</button>
          </div>
        `;
        upcomingList.prepend(newCard);
      }

      switchTab('appointments');
      showToast(`🎉 Appointment booked with ${newBooking.artist} for ${newBooking.time}!`, 'success', 4500);
    });
  }

  // =========================================================================
  // 7. FILTER PILLS & LIVE SEARCH
  // =========================================================================
  const filterBtns = document.querySelectorAll('.style-filter-btn[data-filter]');
  const fullDesignsGrid = document.getElementById('full-designs-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      const cards = fullDesignsGrid ? fullDesignsGrid.querySelectorAll('.design-card') : [];

      let matchCount = 0;
      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || cat.includes(filterVal)) {
          card.style.display = 'flex';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      showToast(`Showing ${matchCount} designs for "${btn.textContent.trim()}"`, 'info', 1500);
    });
  });

  // Global Search Input Live Filter
  const globalSearchInput = document.getElementById('global-search-input');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', () => {
      const q = globalSearchInput.value.toLowerCase().trim();
      const cards = fullDesignsGrid ? fullDesignsGrid.querySelectorAll('.design-card') : [];

      if (!q) {
        cards.forEach(c => c.style.display = 'flex');
        return;
      }

      cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const tags = Array.from(card.querySelectorAll('.design-tag-badge')).map(t => t.textContent.toLowerCase()).join(' ');
        if (title.includes(q) || tags.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });

    globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = globalSearchInput.value.toLowerCase().trim();
        if (q) {
          switchTab('designs');
          showToast(`Displaying gallery results for "${q}"`, 'info');
        }
      }
    });

    document.querySelector('.nav-search-box')?.addEventListener('click', (e) => {
      if (e.target === globalSearchInput) return;
      if (window.innerWidth <= 1220) {
        switchTab('designs');
        const term = prompt('Search nail designs, styles, or artists:');
        if (term && term.trim()) {
          globalSearchInput.value = term.trim();
          globalSearchInput.dispatchEvent(new Event('input'));
          showToast(`Filtering designs for "${term.trim()}"`, 'info');
        }
      }
    });
  }

  // =========================================================================
  // 8. MODALS & PROMO ACTIONS
  // =========================================================================
  const genericModal = document.getElementById('generic-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openModal(heading, desc, htmlContent) {
    if (!genericModal) return;
    document.getElementById('modal-heading').textContent = heading;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('modal-body-content').innerHTML = htmlContent;
    genericModal.classList.add('active');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => genericModal.classList.remove('active'));
  }
  if (genericModal) {
    genericModal.addEventListener('click', (e) => {
      if (e.target === genericModal) genericModal.classList.remove('active');
    });
  }

  // Notification Drawer / Modal
  document.getElementById('header-notif-btn')?.addEventListener('click', () => {
    openModal(
      'Studio Notifications',
      'Recent updates and concierge alerts for your account',
      `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="background:var(--cream); padding:12px; border-radius:var(--radius-md); border-left:3px solid var(--sage);">
            <div style="font-weight:700; color:var(--navy);">Appointment Reminder</div>
            <div class="secondary-text" style="font-size:13px; margin-top:2px;">Your session with Sarah Lawrence is confirmed for Aug 31 at 4:30 PM in Salon Suite 2.</div>
            <div class="caption" style="margin-top:4px;">10 mins ago</div>
          </div>
          <div style="background:var(--cream); padding:12px; border-radius:var(--radius-md); border-left:3px solid var(--champagne-gold);">
            <div style="font-weight:700; color:var(--navy);">VIP Points Credited</div>
            <div class="secondary-text" style="font-size:13px; margin-top:2px;">+50 points earned on your last visit. Total Balance: 450 Points.</div>
            <div class="caption" style="margin-top:4px;">Yesterday</div>
          </div>
          <div style="background:var(--cream); padding:12px; border-radius:var(--radius-md); border-left:3px solid var(--dusty-rose);">
            <div style="font-weight:700; color:var(--navy);">New Seasonal Lookbook</div>
            <div class="secondary-text" style="font-size:13px; margin-top:2px;">Discover our 12 signature Autumn Glaze & Velvet Chrome designs in the gallery.</div>
            <div class="caption" style="margin-top:4px;">3 days ago</div>
          </div>
        </div>
      `
    );
  });

  // User Profile Modal
  document.getElementById('header-profile-btn')?.addEventListener('click', () => {
    openModal(
      'Member Profile & VIP Privileges',
      'Helinart Salon Suite Concierge',
      `
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; align-items:center; gap:14px; background:var(--cream); padding:14px; border-radius:var(--radius-md);">
            <div class="user-avatar" style="width:48px; height:48px; font-size:16px;">H</div>
            <div>
              <div class="card-title" style="font-size:17px;">Haritha</div>
              <div class="caption" style="color:var(--champagne-gold); font-weight:700;">♛ VIP Member</div>
              <div class="secondary-text" style="font-size:12px;">Client Ref: #HL-2024-8891</div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="background:var(--cream); padding:12px; border-radius:var(--radius-md); text-align:center;">
              <div class="caption">REWARD POINTS</div>
              <strong style="font-size:22px; color:var(--navy);">450</strong>
            </div>
            <div style="background:var(--cream); padding:12px; border-radius:var(--radius-md); text-align:center;">
              <div class="caption">COMPLETED VISITS</div>
              <strong style="font-size:22px; color:var(--navy);">14</strong>
            </div>
          </div>

          <div style="background:var(--cream); padding:12px; border-radius:var(--radius-md); font-size:13px;">
            <strong style="color:var(--navy);">Concierge Perks:</strong>
            <ul style="margin-top:6px; margin-left:16px; color:var(--taupe); display:flex; flex-direction:column; gap:4px;">
              <li>Complimentary Rose Botanical Iced Tea & Macarons</li>
              <li>Free emergency nail fix within 14 days</li>
              <li>Priority access to Saturday & Holiday evening slots</li>
            </ul>
          </div>
        </div>
      `
    );
  });

  document.getElementById('view-appt-btn')?.addEventListener('click', () => {
    openModal(
      'Upcoming Appointment Details',
      'Helinart Salon Suite 2 — Ref: #HL-82910',
      `
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div><strong>Treatment:</strong> Gel Extension + Velvet Chrome Art</div>
          <div><strong>Artist:</strong> Sarah Lawrence (Master Stylist)</div>
          <div><strong>Schedule:</strong> Aug 31, 2026 at 4:30 PM (90 mins)</div>
          <div><strong>Estimated Total:</strong> ₹1,199 (Pay at Salon / Card / UPI)</div>
          <div><strong>Salon Complimentary:</strong> Iced Rose Botanical Tea & Keratin Hydration</div>
        </div>
      `
    );
  });

  document.getElementById('reschedule-appt-btn')?.addEventListener('click', () => {
    switchTab('booking');
    showToast('Select a new date and time slot to reschedule your appointment', 'info');
  });

  document.getElementById('cancel-appt-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel your upcoming appointment on Aug 31?')) {
      showToast('Appointment cancelled. No cancellation fee applied.', 'info');
    }
  });

  document.querySelectorAll('.promo-claim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code') || 'HELIN20';
      navigator.clipboard.writeText(code).then(() => {
        showToast(`Promo code "${code}" copied to clipboard! (20% Off)`, 'success');
      }).catch(() => {
        showToast(`Promo code "${code}" applied!`, 'success');
      });
    });
  });

  document.getElementById('share-referral-btn')?.addEventListener('click', () => {
    showToast('Referral link "helinart.com/ref/haritha" copied to clipboard!', 'success');
  });

  document.getElementById('join-vip-pass-btn')?.addEventListener('click', () => {
    showToast('Welcome to Helinart VIP Club! Monthly pass activated.', 'success');
  });

  document.getElementById('claim-vip-btn')?.addEventListener('click', () => {
    showToast('20% VIP Reward discount applied to your account!', 'success');
  });

  // =========================================================================
  // 9. INITIALIZATION
  // =========================================================================
  handleHashChange();
  calculatePrice();
  updateFavBadges();
  updateBookingSummary();
});
