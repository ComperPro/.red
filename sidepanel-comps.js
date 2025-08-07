/**
 * COMPS.RED - Side Panel Interface
 * Clean, professional comparable analysis interface
 */

class CompsRedSidePanel {
  constructor() {
    this.currentDeck = null;
    this.isDrawingCards = false;
    this.initializePanel();
  }

  async initializePanel() {
    console.log('[COMPS.RED] Initializing panel...');
    
    try {
      // Create new comps deck
      this.currentDeck = new CompsDeck();
      console.log('[COMPS.RED] Deck created:', this.currentDeck);
      
      // Initialize UI elements
      this.initializeElements();
      this.attachEventListeners();
      this.updateUI();
      
      // Check if we're on Zillow
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('[COMPS.RED] Current tab:', tab?.url);
      this.checkZillowPage(tab?.url);
    } catch (error) {
      console.error('[COMPS.RED] Initialization error:', error);
    }
  }

  initializeElements() {
    // Header elements
    this.brandLogo = document.getElementById('brandLogo');
    this.brandName = document.getElementById('brandName');
    
    // Stats display
    this.primaryCardCount = document.getElementById('primaryCardCount');
    this.compCardCount = document.getElementById('compCardCount');
    this.deckStatus = document.getElementById('deckStatus');
    
    // Action buttons
    this.drawCardBtn = document.getElementById('drawCardBtn');
    this.viewDeckBtn = document.getElementById('viewDeckBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.clearDeckBtn = document.getElementById('clearDeckBtn');
    
    // Debug: Log which buttons were found
    console.log('[COMPS.RED] Button elements found:', {
      drawCardBtn: !!this.drawCardBtn,
      viewDeckBtn: !!this.viewDeckBtn,
      exportBtn: !!this.exportBtn,
      clearDeckBtn: !!this.clearDeckBtn
    });
    
    // Cards container
    this.cardsContainer = document.getElementById('cardsContainer');
    
    // Update branding
    this.updateBranding();
  }

  updateBranding() {
    // Update to COMPS.RED branding
    if (this.brandName) {
      this.brandName.textContent = 'COMPS.RED';
      this.brandName.style.color = '#DC2626';
    }
    
    document.title = 'COMPS.RED - Professional Comps';
  }
  
  updateUI() {
    // Update stats display
    this.updateStats();
    
    // Update cards display
    if (this.cardsContainer) {
      this.cardsContainer.innerHTML = '';
      this.currentDeck.cards.forEach(card => {
        const cardElement = this.createCardElement(card);
        this.cardsContainer.appendChild(cardElement);
      });
    }
  }

  attachEventListeners() {
    console.log('[COMPS.RED] Attaching event listeners...');
    console.log('[COMPS.RED] Buttons found:', {
      drawCardBtn: !!this.drawCardBtn,
      viewDeckBtn: !!this.viewDeckBtn,
      exportBtn: !!this.exportBtn,
      clearDeckBtn: !!this.clearDeckBtn
    });
    
    // Draw card button
    if (this.drawCardBtn) {
      this.drawCardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[COMPS.RED] Draw button clicked!', {
          target: e.target,
          currentTarget: e.currentTarget,
          buttonDisabled: this.drawCardBtn.disabled,
          timestamp: new Date().toISOString()
        });
        try {
          this.handleDrawCard();
        } catch (error) {
          console.error('[COMPS.RED] Error in handleDrawCard:', error);
        }
      });
      console.log('[COMPS.RED] Draw button listener attached successfully');
    } else {
      console.error('[COMPS.RED] Draw button not found in DOM!');
    }
    
    // View deck button (Score Hand)
    if (this.viewDeckBtn) {
      this.viewDeckBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[COMPS.RED] View deck/Score Hand button clicked');
        console.log('[COMPS.RED] Button ID:', e.target.id || e.target.parentElement.id);
        this.viewFullDeck();
      });
    }
    
    // Export button (Cash Out)
    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[COMPS.RED] Export/Cash Out button clicked');
        console.log('[COMPS.RED] Button ID:', e.target.id || e.target.parentElement.id);
        this.showExportOptions();
      });
    }
    
    // Clear deck button
    if (this.clearDeckBtn) {
      this.clearDeckBtn.addEventListener('click', () => {
        console.log('[COMPS.RED] Clear deck button clicked');
        this.clearDeck();
      });
    }
    
    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'PROPERTY_DATA') {
        this.handlePropertyData(request.data);
        sendResponse({ success: true });
      }
    });
  }

  checkZillowPage(url) {
    const isZillow = url && (url.includes('zillow.com'));
    
    if (isZillow) {
      this.enableDrawing();
      this.updateStatus('🎴 Ready to deal your first hand!');
    } else {
      this.disableDrawing();
      this.updateStatus('🎯 Navigate to Zillow to start dealing comps!');
    }
  }

  enableDrawing() {
    this.drawCardBtn.disabled = false;
    this.drawCardBtn.classList.remove('disabled');
  }

  disableDrawing() {
    this.drawCardBtn.disabled = true;
    this.drawCardBtn.classList.add('disabled');
  }

  async handleDrawCard() {
    console.log('[COMPS.RED] Draw card button clicked');
    
    if (this.isDrawingCards) {
      console.log('[COMPS.RED] Already drawing cards, skipping');
      return;
    }
    
    this.isDrawingCards = true;
    this.updateDrawButton('drawing');
    
    try {
      // Send message to content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('[COMPS.RED] Sending DRAW_CARDS message to tab:', tab?.id);
      
      // Inject content script first if needed
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }).catch(() => console.log('Content script already injected'));
      
      const response = await chrome.tabs.sendMessage(tab.id, { 
        type: "DRAW_CARDS",
        source: "COMPS.RED"
      });
      
      console.log("[COMPS.RED] Received response:", response);
      
      if (response?.success && response?.properties) {
        // Process each property
        response.properties.forEach(property => {
          this.handlePropertyData(property);
        });
        
        this.updateStatus(`🎯 Dealt ${response.properties.length} cards to your hand!`);
      } else {
        this.updateStatus("🚫 No cards found on this page");
      }
      
      // Reset button
      this.isDrawingCards = false;
      this.updateDrawButton("ready");      
    } catch (error) {
      console.error('[COMPS.RED] Error drawing cards:', error);
      
      if (error.message?.includes('Could not establish connection')) {
        this.updateStatus('🔄 Please refresh the Zillow page and try again');
      } else if (error.message?.includes('Cannot access')) {
        this.updateStatus('🚫 Please navigate to a Zillow property page');
      } else {
        this.updateStatus('❌ Error: ' + (error.message || 'Could not draw cards'));
      }
      
      this.isDrawingCards = false;
      this.updateDrawButton('ready');
    }
  }

  updateDrawButton(state) {
    const icon = this.drawCardBtn.querySelector('.button-icon');
    const text = this.drawCardBtn.querySelector('.button-text');
    
    switch (state) {
      case 'drawing':
        icon.textContent = '🎰';
        text.textContent = 'Dealing...';
        this.drawCardBtn.classList.add('drawing');
        break;
      case 'ready':
      default:
        icon.textContent = '🎴';
        // Change text based on whether deck is empty
        const isEmpty = !this.currentDeck || this.currentDeck.cards.length === 0;
        text.textContent = isEmpty ? "Deal your first card" : "Deal Cards";
        this.drawCardBtn.classList.remove("drawing");
        break;
    }
  }
  handlePropertyData(propertyData) {
    // Add property to deck
    const card = this.currentDeck.addCard(propertyData);
    
    // Update UI
    this.addCardToUI(card);
    this.updateStats();
    this.updateStatus(`🎯 ${card.isMaster ? 'Primary card dealt!' : `${card.label} added to your hand!`}`);
  }

  addCardToUI(card) {
    const cardElement = this.createCardElement(card);
    this.cardsContainer.appendChild(cardElement);
    
    // Animate card entry
    requestAnimationFrame(() => {
      cardElement.classList.add('card-enter');
    });
  }

  createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `property-card ${card.isMaster ? 'master-card' : 'comp-card'}`;
    cardDiv.dataset.cardId = card.id;
    
    const data = card.data;
    const comparison = card.comparisonToPrimary;
    
    // Get the first image or use default
    const imageUrl = (data.images && data.images.length > 0) ? data.images[0] : 'icons/icon128.png';
    
    // Build price difference HTML separately to avoid nested template issues
    let priceDiffHtml = '';
    if (comparison) {
      const diffClass = comparison.priceDiff > 0 ? 'higher' : 'lower';
      const diffSign = comparison.priceDiff > 0 ? '+' : '';
      const diffAmount = Math.abs(comparison.priceDiff).toLocaleString();
      priceDiffHtml = `<span class="price-diff ${diffClass}">${diffSign}$${diffAmount} (${comparison.priceDiffPercent}%)</span>`;
    }
    
    // Build card HTML
    cardDiv.innerHTML = `
      <div class="card-header">
        <span class="card-label ${card.isMaster ? 'master-label' : 'comp-label'}">
          ${card.isMaster ? '👑 PRIMARY' : card.label}
        </span>
        ${comparison ? `<span class="comp-score">Score: ${comparison.comparabilityScore}%</span>` : ''}
      </div>
      
      <div class="card-body">
        <div class="property-image-container">
          <img src="${imageUrl}" 
               alt="${data.address}" 
               class="property-image">
        </div>
        
        <div class="property-details">
          <div class="address">${data.address}</div>
          
          <div class="price-info">
            <span class="price">$${data.price.toLocaleString()}</span>
            <span class="price-per-sqft">$${data.pricePerSqft}/sqft</span>
            ${priceDiffHtml}
          </div>
          
          <div class="property-specs">
            <span>🛏 ${data.beds}</span>
            <span>🛁 ${data.baths}</span>
            <span>📐 ${data.sqft.toLocaleString()} sqft</span>
          </div>
          
          <div class="property-meta">
            <span>Built ${data.yearBuilt}</span>
            <span>${data.propertyType}</span>
            ${data.daysOnMarket > 0 ? `<span>${data.daysOnMarket} DOM</span>` : ''}
          </div>
        </div>
      </div>
      
      <div class="card-actions">
        <button class="card-action-btn view-btn" data-card-id="${card.id}">
          <span>👁</span> View
        </button>
        <button class="card-action-btn remove-btn" data-card-id="${card.id}">
          <span>🗑</span> Remove
        </button>
      </div>
    `;
    
    // Add event listeners after creating the element
    const viewBtn = cardDiv.querySelector('.view-btn');
    const removeBtn = cardDiv.querySelector('.remove-btn');
    
    if (viewBtn) {
      viewBtn.addEventListener('click', () => this.viewProperty(card.id));
    }
    
    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removeCard(card.id));
    }
    
    return cardDiv;
  }

  updateStats() {
    const stats = this.currentDeck.cards.reduce((acc, card) => {
      if (card.isMaster) acc.masters++;
      else acc.comps++;
      return acc;
    }, { masters: 0, comps: 0 });
    
    if (this.primaryCardCount) this.primaryCardCount.textContent = stats.masters;
    if (this.compCardCount) this.compCardCount.textContent = stats.comps;
    
    // Update deck status
    if (stats.masters === 0) {
      this.updateDeckStatus('empty', '🎴 Deal your first card to start the game!');
    } else if (stats.comps === 0) {
      this.updateDeckStatus('needs-comps', '🎯 Draw comp cards to build your hand');
    } else if (stats.comps < 3) {
      this.updateDeckStatus('building', `🃏 ${3 - stats.comps} more cards for a full hand!`);
    } else {
      this.updateDeckStatus('ready', '🏆 Full house! Ready to score your hand');
    }
    
    // Update button text based on deck status
    this.updateDrawButton("ready");
  }
  updateDeckStatus(status, message) {
    if (this.deckStatus) {
      this.deckStatus.className = `deck-status ${status}`;
      this.deckStatus.textContent = message;
    }
  }

  updateStatus(message) {
    // Create status toast
    const toast = document.createElement('div');
    toast.className = 'status-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  async viewFullDeck() {
    // Generate analysis
    const analysis = this.currentDeck.generateAnalysis();
    
    // Open viewer with deck data
    const viewerUrl = chrome.runtime.getURL('viewer.html');
    const deckData = {
      deck: this.currentDeck,
      analysis: analysis
    };
    
    // Store deck data for viewer
    await chrome.storage.session.set({ currentDeckView: deckData });
    
    // Open viewer
    chrome.tabs.create({ url: viewerUrl });
  }

  showExportOptions() {
    console.log('[COMPS.RED] showExportOptions called');
    
    // Check if deck has cards
    if (!this.currentDeck || this.currentDeck.cards.length === 0) {
      this.updateStatus('🚫 No cards to export! Deal some cards first.');
      return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>💰 Cash Out Your Deck</h3>
        <p style="margin: 12px 0; color: #6B7280;">Export ${this.currentDeck.cards.length} properties</p>
        <div class="export-options" style="display: flex; flex-direction: column; gap: 8px;">
          <button class="export-csv" style="padding: 12px; border: 1px solid #E5E7EB; border-radius: 4px; cursor: pointer;">
            <span>📊</span> Export as CSV
          </button>
          <button class="export-json" style="padding: 12px; border: 1px solid #E5E7EB; border-radius: 4px; cursor: pointer;">
            <span>📄</span> Export as JSON
          </button>
          <button class="export-pdf" style="padding: 12px; border: 1px solid #E5E7EB; border-radius: 4px; cursor: pointer; opacity: 0.5;">
            <span>📑</span> Export as PDF (Coming Soon)
          </button>
        </div>
        <button class="modal-close" style="margin-top: 16px; padding: 8px 16px; background: #EF4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Cancel
        </button>
      </div>
    `;
    
    // Add event listeners
    modal.querySelector('.export-csv').addEventListener('click', () => {
      console.log('[COMPS.RED] Export CSV clicked');
      this.exportDeck('csv');
    });
    modal.querySelector('.export-json').addEventListener('click', () => {
      console.log('[COMPS.RED] Export JSON clicked');
      this.exportDeck('json');
    });
    modal.querySelector('.export-pdf').addEventListener('click', () => {
      console.log('[COMPS.RED] PDF export not implemented yet');
      this.updateStatus('📑 PDF export coming soon!');
    });
    modal.querySelector('.modal-close').addEventListener('click', () => {
      console.log('[COMPS.RED] Modal close clicked');
      modal.remove();
    });
    
    console.log('[COMPS.RED] Appending modal to body');
    document.body.appendChild(modal);
  }

  async exportDeck(format) {
    const exportData = this.currentDeck.exportDeck(format);
    const filename = `COMPS_RED_${new Date().toISOString().slice(0, 10)}_${Date.now()}.${format}`;
    
    // Create blob and download
    const blob = new Blob([exportData], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
    
    // Close modal
    document.querySelector('.export-modal')?.remove();
    this.updateStatus(`💰 Cashed out your deck as ${format.toUpperCase()}!`);
  }

  async clearDeck() {
    if (confirm('🔄 Fold this hand and start fresh?')) {
      this.currentDeck = new CompsDeck();
      this.cardsContainer.innerHTML = '';
      this.updateStats();
      this.updateStatus('🔄 New game! Deck shuffled and ready');
    }
  }

  removeCard(cardId) {
    const cardIndex = this.currentDeck.cards.findIndex(card => card.id === cardId);
    if (cardIndex > -1) {
      this.currentDeck.cards.splice(cardIndex, 1);
      document.querySelector(`[data-card-id="${cardId}"]`)?.remove();
      this.updateStats();
      this.updateStatus('🗑️ Card discarded from your hand');
    }
  }

  viewProperty(cardId) {
    const card = this.currentDeck.cards.find(c => c.id === cardId);
    if (card && card.data.zpid) {
      chrome.tabs.create({ 
        url: `https://www.zillow.com/homedetails/${card.data.zpid}_zpid/` 
      });
    }
  }
}

// Initialize panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // For Dawson & Marc - see the red, pull your cards
  console.log('%c🎴 D&M: Hope you see that red. Pull out your cards to get out. Still love you both.', 'color: #DC2626; font-weight: bold;');
  try {
    console.log('[COMPS.RED] DOM loaded, initializing panel...');
    window.compsPanel = new CompsRedSidePanel();
    console.log('[COMPS.RED] Panel initialized successfully');
  } catch (error) {
    console.error('[COMPS.RED] Failed to initialize panel:', error);
    console.error('[COMPS.RED] Stack trace:', error.stack);
  }
});

// Add global error handler for debugging
window.addEventListener('error', (event) => {
  console.error('[COMPS.RED] Global error:', event.error);
});