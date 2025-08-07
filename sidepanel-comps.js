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
    console.log('[COMPS.RED] Initializing revolutionary real estate platform...');
    
    // Start loading animation
    this.showLoadingScreen();
    
    try {
      // Simulate realistic loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      
      // Hide loading screen with smooth transition
      this.hideLoadingScreen();
      
      // Show welcome message for first-time users
      this.showWelcomeMessage();
      
    } catch (error) {
      console.error('[COMPS.RED] Initialization error:', error);
      this.hideLoadingScreen();
      this.updateStatus('❌ Initialization failed - please refresh');
    }
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
      // Animate loading progress
      const progress = loadingScreen.querySelector('.loading-progress');
      if (progress) {
        progress.style.animation = 'loading-progress 2s ease-in-out infinite';
      }
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      document.body.classList.remove('loading');
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }
  }

  showWelcomeMessage() {
    const isFirstTime = !localStorage.getItem('comps-red-welcomed');
    if (isFirstTime) {
      setTimeout(() => {
        this.updateStatus('🚀 Welcome to COMPS.RED - Revolutionizing real estate analysis!');
        localStorage.setItem('comps-red-welcomed', 'true');
      }, 500);
    }
  }

  initializeElements() {
    // Header elements
    this.brandLogo = document.getElementById('brandLogo');
    this.brandName = document.getElementById('brandName');
    
    // Enhanced stats display
    this.primaryCardCount = document.getElementById('primaryCardCount');
    this.compCardCount = document.getElementById('compCardCount');
    this.suggestedValue = document.getElementById('suggestedValue');
    this.accuracyScore = document.getElementById('accuracyScore');
    this.deckStatus = document.getElementById('deckStatus');
    this.commissionSaved = document.querySelector('.saved-amount');
    
    // Enhanced action buttons
    this.drawCardBtn = document.getElementById('drawCardBtn');
    this.viewDeckBtn = document.getElementById('viewDeckBtn');
    this.renovationBtn = document.getElementById('renovationBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.aiInsightsBtn = document.getElementById('aiInsightsBtn');
    this.clearDeckBtn = document.getElementById('clearDeckBtn');
    
    // Debug: Log which buttons were found
    console.log('[COMPS.RED] Button elements found:', {
      drawCardBtn: !!this.drawCardBtn,
      viewDeckBtn: !!this.viewDeckBtn,
      renovationBtn: !!this.renovationBtn,
      exportBtn: !!this.exportBtn,
      aiInsightsBtn: !!this.aiInsightsBtn,
      clearDeckBtn: !!this.clearDeckBtn
    });
    
    // Cards container
    this.cardsContainer = document.getElementById('cardsContainer');
    
    // Initialize renovation calculator
    this.renovationCalc = new RenovationCalculator();
    this.renovationUI = new RenovationUI(this.renovationCalc);
    
    // Initialize AI insights engine
    this.aiEngine = new AIInsightsEngine();
    
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
    
    // Renovation button
    if (this.renovationBtn) {
      this.renovationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[COMPS.RED] Renovation button clicked');
        this.showRenovationCalculator();
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
    
    // AI Insights button
    if (this.aiInsightsBtn) {
      this.aiInsightsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[COMPS.RED] AI Insights button clicked');
        this.showAIInsights();
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
    // Validate and clean property data
    const cleanedData = this.validatePropertyData(propertyData);
    if (!cleanedData) {
      this.updateStatus('⚠️ Invalid property data - skipping this card');
      return;
    }
    
    // Add property to deck
    const card = this.currentDeck.addCard(cleanedData);
    
    // Update UI
    this.addCardToUI(card);
    this.updateStats();
    this.updateStatus(`🎯 ${card.isMaster ? 'Primary card dealt!' : `${card.label} added to your hand!`}`);
  }

  validatePropertyData(data) {
    if (!data || typeof data !== 'object') return null;
    
    // Ensure required fields exist with defaults
    return {
      zpid: data.zpid || 'unknown',
      address: data.address || 'Address not available',
      city: data.city || '',
      state: data.state || '',
      zipcode: data.zipcode || '',
      
      price: Math.max(0, parseInt(data.price) || 0),
      beds: Math.max(0, parseInt(data.beds) || 0),
      baths: Math.max(0, parseFloat(data.baths) || 0),
      sqft: Math.max(1, parseInt(data.sqft) || parseInt(data.livingArea) || 1), // Prevent division by zero
      lotSize: Math.max(0, parseInt(data.lotSize) || 0),
      yearBuilt: parseInt(data.yearBuilt) || new Date().getFullYear(),
      
      propertyType: data.propertyType || data.homeType || 'Unknown',
      listingStatus: data.listingStatus || data.homeStatus || 'Unknown',
      daysOnMarket: Math.max(0, parseInt(data.daysOnMarket) || parseInt(data.daysOnZillow) || 0),
      
      images: Array.isArray(data.images) ? data.images : [],
      
      // Additional data with defaults
      zestimate: Math.max(0, parseInt(data.zestimate) || 0),
      rentZestimate: Math.max(0, parseInt(data.rentZestimate) || 0),
      monthlyHoaFee: Math.max(0, parseInt(data.monthlyHoaFee) || 0),
      propertyTaxRate: Math.max(0, parseFloat(data.propertyTaxRate) || 0),
      
      // Schools with safe defaults
      schools: {
        elementary: data.schools?.elementary || data.elementarySchool || 'Not available',
        middle: data.schools?.middle || data.middleSchool || 'Not available',
        high: data.schools?.high || data.highSchool || 'Not available'
      }
    };
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
            <span class="price-per-sqft">$${Math.round(data.price / data.sqft)}/sqft</span>
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
    
    // Update basic counts
    if (this.primaryCardCount) this.primaryCardCount.textContent = stats.masters;
    if (this.compCardCount) this.compCardCount.textContent = stats.comps;
    
    // Calculate and update suggested value
    const analysis = this.currentDeck.generateAnalysis();
    if (analysis?.summary?.suggestedValue && this.suggestedValue) {
      this.suggestedValue.textContent = `$${Math.round(analysis.summary.suggestedValue / 1000)}K`;
    }
    
    // Calculate accuracy score based on comparable quality
    const accuracyScore = this.calculateAccuracyScore();
    if (this.accuracyScore) {
      this.accuracyScore.textContent = `${accuracyScore}%`;
    }
    
    // Calculate commission saved (6% of suggested value)
    if (analysis?.summary?.suggestedValue && this.commissionSaved) {
      const commissionSaved = Math.round(analysis.summary.suggestedValue * 0.06);
      this.commissionSaved.textContent = `$${(commissionSaved / 1000).toFixed(0)}K`;
    }
    
    // Update enhanced deck status
    this.updateEnhancedDeckStatus(stats);
    
    // Update button text based on deck status
    this.updateDrawButton("ready");
  }

  calculateAccuracyScore() {
    if (!this.currentDeck || this.currentDeck.cards.length < 2) return 0;
    
    const comparables = this.currentDeck.cards.filter(card => !card.isMaster);
    if (comparables.length === 0) return 0;
    
    // Average the comparability scores
    const totalScore = comparables.reduce((sum, card) => {
      return sum + (card.comparisonToPrimary?.comparabilityScore || 0);
    }, 0);
    
    return Math.round(totalScore / comparables.length);
  }

  updateEnhancedDeckStatus(stats) {
    const statusElement = this.deckStatus?.querySelector('.status-text');
    const progressElement = document.getElementById('statusProgress');
    
    if (!statusElement) return;
    
    if (stats.masters === 0) {
      statusElement.textContent = 'Ready to revolutionize your analysis!';
      this.updateProgressBar(progressElement, 0);
    } else if (stats.comps === 0) {
      statusElement.textContent = 'Primary property loaded - add comparables';
      this.updateProgressBar(progressElement, 25);
    } else if (stats.comps < 3) {
      statusElement.textContent = `Building analysis deck - ${3 - stats.comps} more needed`;
      this.updateProgressBar(progressElement, 25 + (stats.comps * 25));
    } else {
      statusElement.textContent = 'Analysis complete - ready for insights!';
      this.updateProgressBar(progressElement, 100);
    }
  }

  updateProgressBar(element, percentage) {
    if (element) {
      element.style.setProperty('--progress-width', `${percentage}%`);
      element.style.width = `${percentage}%`;
    }
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

  showAIInsights() {
    console.log('[COMPS.RED] Generating AI-powered market insights...');
    
    if (!this.currentDeck || this.currentDeck.cards.length < 2) {
      this.updateStatus('🧠 Need at least 2 properties to generate AI insights');
      return;
    }
    
    const insights = this.generateAIInsights();
    
    const modal = document.createElement('div');
    modal.className = 'ai-insights-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-container ai-container">
          <div class="modal-header ai-header">
            <h2>🧠 AI Market Insights</h2>
            <div class="ai-badge">POWERED BY 250+ FLIP EXPERIENCE</div>
            <button class="modal-close-btn" id="closeAIModal">×</button>
          </div>
          <div class="modal-body">
            ${this.renderAIInsights(insights)}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = document.getElementById('closeAIModal');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => modal.remove();
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    
    // ESC key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    this.updateStatus('🧠 AI insights generated from veteran flip experience!');
  }

  generateAIInsights() {
    const analysis = this.currentDeck.generateAnalysis();
    const primary = this.currentDeck.primaryCard;
    const comparables = this.currentDeck.cards.filter(card => !card.isMaster);
    
    return {
      marketTrend: this.aiEngine.analyzeMarketTrend(analysis),
      dealQuality: this.aiEngine.analyzeDealQuality(primary, analysis),
      riskFactors: this.aiEngine.identifyRiskFactors(primary, comparables),
      opportunities: this.aiEngine.identifyOpportunities(primary, comparables),
      priceRecommendation: this.aiEngine.generatePriceRecommendation(analysis),
      flipPotential: this.aiEngine.assessFlipPotential(primary, analysis),
      timeToSell: this.aiEngine.estimateTimeToSell(primary, comparables),
      competitionLevel: this.aiEngine.assessCompetition(comparables)
    };
  }

  renderAIInsights(insights) {
    return `
      <div class="ai-insights">
        <div class="insights-grid">
          <div class="insight-card deal-quality">
            <div class="insight-header">
              <span class="insight-icon">${insights.dealQuality.icon}</span>
              <h3>Deal Quality</h3>
            </div>
            <div class="insight-score ${insights.dealQuality.level}">${insights.dealQuality.score}/10</div>
            <p class="insight-text">${insights.dealQuality.analysis}</p>
          </div>
          
          <div class="insight-card market-trend">
            <div class="insight-header">
              <span class="insight-icon">📈</span>
              <h3>Market Trend</h3>
            </div>
            <div class="insight-value">${insights.marketTrend.direction}</div>
            <p class="insight-text">${insights.marketTrend.analysis}</p>
          </div>
          
          <div class="insight-card flip-potential">
            <div class="insight-header">
              <span class="insight-icon">🔄</span>
              <h3>Flip Potential</h3>
            </div>
            <div class="insight-value">${insights.flipPotential.profit}</div>
            <p class="insight-text">${insights.flipPotential.analysis}</p>
          </div>
          
          <div class="insight-card time-to-sell">
            <div class="insight-header">
              <span class="insight-icon">⏰</span>
              <h3>Time to Sell</h3>
            </div>
            <div class="insight-value">${insights.timeToSell.estimate}</div>
            <p class="insight-text">${insights.timeToSell.analysis}</p>
          </div>
        </div>
        
        <div class="detailed-insights">
          <div class="risk-factors">
            <h3>🚨 Risk Factors</h3>
            <ul class="risk-list">
              ${insights.riskFactors.map(risk => `<li class="risk-item ${risk.severity}">${risk.description}</li>`).join('')}
            </ul>
          </div>
          
          <div class="opportunities">
            <h3>💎 Opportunities</h3>
            <ul class="opportunity-list">
              ${insights.opportunities.map(opp => `<li class="opportunity-item">${opp.description}</li>`).join('')}
            </ul>
          </div>
          
          <div class="price-recommendation">
            <h3>💰 Price Recommendation</h3>
            <div class="price-ranges">
              <div class="price-range">
                <span class="range-label">Conservative Offer:</span>
                <span class="range-value">${insights.priceRecommendation.conservative}</span>
              </div>
              <div class="price-range">
                <span class="range-label">Aggressive Offer:</span>
                <span class="range-value">${insights.priceRecommendation.aggressive}</span>
              </div>
              <div class="price-range highlight">
                <span class="range-label">Sweet Spot:</span>
                <span class="range-value">${insights.priceRecommendation.sweetSpot}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="ai-footer">
          <div class="disclaimer">
            <strong>⚡ VETERAN INSIGHT:</strong> These recommendations are based on 250+ successful flips and revolutionary scoring algorithms.
            Always verify with local market conditions and professional due diligence.
          </div>
        </div>
      </div>
    `;
  }

  showRenovationCalculator() {
    console.log('[COMPS.RED] Opening renovation calculator');
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'renovation-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2>🔨 Renovation Calculator</h2>
            <button class="modal-close-btn" id="closeRenovationModal">×</button>
          </div>
          <div class="modal-body">
            ${this.renovationUI.createCalculatorHTML()}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Attach event listeners
    this.renovationUI.attachEventListeners();
    
    // Close modal functionality
    const closeBtn = document.getElementById('closeRenovationModal');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
      modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    
    // ESC key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    this.updateStatus('🔨 Renovation calculator opened!');
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

  showRenovationCalculator() {
    console.log('[COMPS.RED] Opening renovation calculator');
    
    // Create modal for renovation calculator
    const modal = document.createElement('div');
    modal.className = 'renovation-modal';
    modal.innerHTML = `
      <div class="modal-content renovation-modal-content">
        <button class="modal-close" onclick="this.closest('.renovation-modal').remove()">✖</button>
        ${this.renovationUI.createCalculatorHTML()}
      </div>
    `;
    
    // Add modal styles if not already present
    if (!document.querySelector('#renovation-modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'renovation-modal-styles';
      styles.textContent = `
        .renovation-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          overflow-y: auto;
        }
        
        .renovation-modal-content {
          background: #1a1a1a;
          padding: 30px;
          border-radius: 12px;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        
        .renovation-calculator h2 {
          color: #DC2626;
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        .calc-subtitle {
          color: #999;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .property-basics, .renovation-scope, .results-section {
          background: #252525;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .property-basics h3, .renovation-scope h3, .results-section h3 {
          color: #fff;
          font-size: 18px;
          margin-bottom: 15px;
        }
        
        .scope-section {
          margin-bottom: 20px;
          padding: 15px;
          background: #1a1a1a;
          border-radius: 6px;
        }
        
        .scope-section h4 {
          color: #DC2626;
          font-size: 16px;
          margin-bottom: 10px;
        }
        
        .input-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .input-row label {
          color: #ccc;
          flex: 1;
        }
        
        .input-row input {
          width: 150px;
          padding: 8px;
          background: #1a1a1a;
          border: 1px solid #444;
          color: #fff;
          border-radius: 4px;
        }
        
        select {
          width: 100%;
          padding: 10px;
          background: #1a1a1a;
          border: 1px solid #444;
          color: #fff;
          border-radius: 4px;
        }
        
        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .checkbox-group label {
          color: #ccc;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .calculate-btn {
          width: 100%;
          padding: 15px;
          background: #DC2626;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .calculate-btn:hover {
          background: #b91c1c;
        }
        
        .breakdown-items, .investment-items, .seventy-items {
          padding: 15px;
          background: #1a1a1a;
          border-radius: 6px;
        }
        
        .breakdown-item, .invest-item, .seventy-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #333;
        }
        
        .breakdown-item.total, .invest-item.total, .seventy-item.total {
          font-weight: bold;
          font-size: 18px;
          color: #DC2626;
          border-top: 2px solid #DC2626;
          margin-top: 10px;
          padding-top: 10px;
        }
        
        .breakdown-item.subtotal {
          font-weight: bold;
          color: #fff;
        }
        
        .invest-item.highlight {
          background: #2a2a2a;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #DC2626;
        }
        
        .summary-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .summary-card {
          background: #252525;
          padding: 20px;
          border-radius: 8px;
        }
        
        .summary-card h4 {
          color: #DC2626;
          margin-bottom: 15px;
        }
        
        .good-deal {
          background: #1a3a1a;
        }
        
        .bad-deal {
          background: #3a1a1a;
        }
        
        .export-btn {
          width: 100%;
          padding: 12px;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
        }
        
        .export-btn:hover {
          background: #047857;
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Attach event listeners for the renovation calculator
    this.renovationUI.attachEventListeners();
    
    // Auto-populate if we have property data
    if (this.currentDeck && this.currentDeck.cards.length > 0) {
      const primaryCard = this.currentDeck.cards[0];
      if (primaryCard && primaryCard.data) {
        const sqftInput = document.getElementById('reno-sqft');
        const priceInput = document.getElementById('purchase-price');
        
        if (sqftInput && primaryCard.data.livingArea) {
          sqftInput.value = primaryCard.data.livingArea;
        }
        if (priceInput && primaryCard.data.price) {
          priceInput.value = primaryCard.data.price;
        }
        
        // Set bathroom count if available
        const bathroomInput = document.getElementById('bathroom-count');
        if (bathroomInput && primaryCard.data.bathrooms) {
          bathroomInput.value = primaryCard.data.bathrooms;
        }
      }
    }
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