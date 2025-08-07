// COMPS.RED Data Storage System - No blockchain bullshit needed

class CompsDataStore {
  constructor() {
    this.dbName = 'COMPS_RED_DB';
    this.version = 1;
    this.db = null;
    this.init();
  }

  async init() {
    // IndexedDB for massive storage (GBs of data)
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Properties store
        if (!db.objectStoreNames.contains('properties')) {
          const propertyStore = db.createObjectStore('properties', { keyPath: 'zpid' });
          propertyStore.createIndex('address', 'address', { unique: false });
          propertyStore.createIndex('price', 'price', { unique: false });
          propertyStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        }
        
        // Comps analysis store
        if (!db.objectStoreNames.contains('analysis')) {
          const analysisStore = db.createObjectStore('analysis', { keyPath: 'id', autoIncrement: true });
          analysisStore.createIndex('propertyId', 'propertyId', { unique: false });
          analysisStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // User preferences
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Save property data
  async saveProperty(propertyData) {
    const transaction = this.db.transaction(['properties'], 'readwrite');
    const store = transaction.objectStore('properties');
    propertyData.dateAdded = new Date().toISOString();
    return store.put(propertyData);
  }

  // Get all properties
  async getAllProperties() {
    const transaction = this.db.transaction(['properties'], 'readonly');
    const store = transaction.objectStore('properties');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Save analysis
  async saveAnalysis(analysis) {
    const transaction = this.db.transaction(['analysis'], 'readwrite');
    const store = transaction.objectStore('analysis');
    analysis.timestamp = new Date().toISOString();
    return store.add(analysis);
  }

  // Export all data as JSON
  async exportData() {
    const properties = await this.getAllProperties();
    const analyses = await this.getAllAnalyses();
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      properties,
      analyses,
      totalSaved: properties.reduce((sum, p) => sum + (p.price * 0.06), 0)
    };
  }

  // Quick localStorage for immediate needs
  quickSave(key, value) {
    localStorage.setItem(`COMPS_RED_${key}`, JSON.stringify(value));
  }

  quickGet(key) {
    const data = localStorage.getItem(`COMPS_RED_${key}`);
    return data ? JSON.parse(data) : null;
  }

  // Session storage for temporary data
  sessionSave(key, value) {
    sessionStorage.setItem(`COMPS_RED_${key}`, JSON.stringify(value));
  }

  sessionGet(key) {
    const data = sessionStorage.getItem(`COMPS_RED_${key}`);
    return data ? JSON.parse(data) : null;
  }
}

// Auto-save current deck every 10 seconds
setInterval(() => {
  if (window.compsPanel?.currentDeck) {
    const store = new CompsDataStore();
    store.quickSave('lastDeck', window.compsPanel.currentDeck);
  }
}, 10000);

// Export for use
window.CompsDataStore = CompsDataStore;