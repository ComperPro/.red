/**
 * COMPS.RED - Core Deck Framework
 * This is the base framework that all deck types will inherit from
 */

class DeckFramework {
  constructor(deckType) {
    this.deckType = deckType;
    this.version = '2.0.0';
    this.cards = [];
    this.primaryCard = null;
    this.settings = this.loadSettings();
    this.capabilities = this.defineCapabilities();
  }

  // Core capabilities shared by all decks
  defineCapabilities() {
    return {
      storage: true,
      export: true,
      share: true,
      collaborate: true,
      analyze: true,
      network: true
    };
  }

  // Card management methods
  addCard(cardData) {
    const card = this.createCard(cardData);
    
    if (this.cards.length === 0 && !this.primaryCard) {
      this.primaryCard = card;
      card.isMaster = true;
      card.label = 'PRIMARY';
    } else {
      card.label = `COMP ${this.cards.length}`;
      card.comparisonToPrimary = this.compareToPrimary(card);
    }
    
    this.cards.push(card);
    this.saveToStorage();
    return card;
  }

  createCard(data) {
    return {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      deckType: this.deckType,
      data: data,
      metadata: {
        source: 'zillow',
        capturedBy: 'COMPS.RED',
        version: this.version
      }
    };
  }

  compareToPrimary(card) {
    if (!this.primaryCard) return null;
    
    // This method will be overridden by specific deck types
    return {
      priceDiff: card.data.price - this.primaryCard.data.price,
      sqftDiff: card.data.sqft - this.primaryCard.data.sqft,
      pricePerSqftDiff: (card.data.price / card.data.sqft) - (this.primaryCard.data.price / this.primaryCard.data.sqft)
    };
  }

  // Storage methods
  async saveToStorage() {
    const storageKey = `deck_${this.deckType}_${this.getDeckId()}`;
    await chrome.storage.local.set({
      [storageKey]: {
        primaryCard: this.primaryCard,
        cards: this.cards,
        metadata: {
          created: this.created || new Date().toISOString(),
          updated: new Date().toISOString(),
          deckType: this.deckType,
          cardCount: this.cards.length
        }
      }
    });
  }

  async loadFromStorage(deckId) {
    const storageKey = `deck_${this.deckType}_${deckId}`;
    const result = await chrome.storage.local.get(storageKey);
    if (result[storageKey]) {
      this.primaryCard = result[storageKey].primaryCard;
      this.cards = result[storageKey].cards;
      this.created = result[storageKey].metadata.created;
    }
    return result[storageKey];
  }

  // Export methods
  exportDeck(format = 'json') {
    const exportData = {
      deckType: this.deckType,
      exportDate: new Date().toISOString(),
      primaryCard: this.primaryCard,
      comparables: this.cards.filter(card => !card.isMaster),
      analysis: this.generateAnalysis(),
      metadata: {
        platform: 'COMPS.RED',
        version: this.version,
        cardCount: this.cards.length
      }
    };

    switch (format) {
      case 'csv':
        return this.convertToCSV(exportData);
      case 'excel':
        return this.convertToExcel(exportData);
      default:
        return JSON.stringify(exportData, null, 2);
    }
  }

  generateAnalysis() {
    // Override in specific deck implementations
    return {
      averagePrice: this.calculateAverage('price'),
      averageSqft: this.calculateAverage('sqft'),
      averagePricePerSqft: this.calculateAverage('pricePerSqft'),
      marketTrend: 'stable'
    };
  }

  // Utility methods
  generateId() {
    return `${this.deckType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getDeckId() {
    return this.deckId || this.generateId();
  }

  calculateAverage(field) {
    if (this.cards.length === 0) return 0;
    const sum = this.cards.reduce((acc, card) => {
      const value = field === 'pricePerSqft' 
        ? card.data.price / card.data.sqft 
        : card.data[field];
      return acc + (value || 0);
    }, 0);
    return sum / this.cards.length;
  }

  loadSettings() {
    // Load user preferences for this deck type
    return {
      autoSave: true,
      notifications: true,
      sharing: 'private',
      theme: 'professional'
    };
  }

  // Network methods for future social features
  async shareDeck(recipients, permissions = 'view') {
    // Implementation for sharing decks with other users
    return {
      shareId: this.generateId(),
      deckId: this.getDeckId(),
      recipients: recipients,
      permissions: permissions,
      sharedAt: new Date().toISOString()
    };
  }

  // Convert methods
  convertToCSV(data) {
    // Implementation for CSV conversion
    let csv = 'Type,Address,Price,Beds,Baths,Sqft,Price/Sqft,Difference from Master\n';
    
    if (data.primaryCard) {
      const m = data.primaryCard.data;
      csv += `PRIMARY,"${m.address}",${m.price},${m.beds},${m.baths},${m.sqft},${(m.price/m.sqft).toFixed(2)},--\n`;
    }
    
    data.comparables.forEach(card => {
      const c = card.data;
      const diff = card.comparisonToPrimary?.priceDiff || 0;
      csv += `${card.label},"${c.address}",${c.price},${c.beds},${c.baths},${c.sqft},${(c.price/c.sqft).toFixed(2)},${diff > 0 ? '+' : ''}${diff}\n`;
    });
    
    return csv;
  }

  convertToExcel(data) {
    // Placeholder for Excel conversion
    // In production, this would use a library like SheetJS
    return this.convertToCSV(data); // For now, return CSV
  }
}

// Export for use in other modules
window.DeckFramework = DeckFramework;