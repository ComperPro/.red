/**
 * COMPS.RED - Comparable Analysis Deck
 * Specialized deck for property comparison and valuation
 */

class CompsDeck extends DeckFramework {
  constructor() {
    super('comps');
    this.deckName = 'COMPS.RED';
    this.analysisMetrics = this.initializeMetrics();
    // Initialize our revolutionary scoring engine
    this.scoringEngine = new EnhancedScoringEngine();
  }

  initializeMetrics() {
    return {
      priceRange: { min: null, max: null },
      sqftRange: { min: null, max: null },
      pricePerSqftRange: { min: null, max: null },
      daysOnMarket: [],
      propertyTypes: new Set(),
      yearBuiltRange: { min: null, max: null }
    };
  }

  // Override addCard to check for duplicates
  addCard(propertyData) {
    // Check if this property already exists in the deck
    const existingCard = this.cards.find(card => 
      card.data.zpid === propertyData.zpid || 
      card.data.address === propertyData.address
    );
    
    if (existingCard) {
      console.log('[COMPS.RED] Duplicate property detected, skipping:', propertyData.address);
      return existingCard; // Return existing card instead of creating duplicate
    }
    
    // If not duplicate, proceed with normal add
    return super.addCard(propertyData);
  }
  
  // Override the createCard method to add comp-specific data
  createCard(propertyData) {
    const card = super.createCard(propertyData);
    
    // Enhanced property data structure
    card.data = {
      // Core identifiers
      zpid: propertyData.zpid,
      address: propertyData.address,
      
      // Pricing data
      price: propertyData.price,
      priceHistory: propertyData.priceHistory || [],
      taxAssessedValue: propertyData.taxAssessedValue,
      
      // Property characteristics
      beds: propertyData.beds,
      baths: propertyData.baths,
      sqft: propertyData.livingArea,
      lotSize: propertyData.lotSize,
      yearBuilt: propertyData.yearBuilt,
      propertyType: propertyData.homeType,
      
      // Status and timing
      listingStatus: propertyData.homeStatus,
      daysOnMarket: propertyData.daysOnZillow || 0,
      listDate: propertyData.datePosted,
      
      // Location and schools
      neighborhood: propertyData.neighborhood,
      schools: {
        elementary: propertyData.elementarySchool,
        middle: propertyData.middleSchool,
        high: propertyData.highSchool
      },
      
      // Additional metrics
      zestimate: propertyData.zestimate,
      rentZestimate: propertyData.rentZestimate,
      monthlyHoaFee: propertyData.monthlyHoaFee || 0,
      propertyTaxRate: propertyData.propertyTaxRate,
      
      // Images and media
      images: propertyData.images || [],
      virtualTourUrl: propertyData.virtualTourUrl
    };

    // Calculate price per sqft
    card.data.pricePerSqft = card.data.sqft > 0 
      ? Math.round(card.data.price / card.data.sqft) 
      : 0;

    this.updateMetrics(card.data);
    return card;
  }

  updateMetrics(data) {
    // Update price range
    if (!this.analysisMetrics.priceRange.min || data.price < this.analysisMetrics.priceRange.min) {
      this.analysisMetrics.priceRange.min = data.price;
    }
    if (!this.analysisMetrics.priceRange.max || data.price > this.analysisMetrics.priceRange.max) {
      this.analysisMetrics.priceRange.max = data.price;
    }

    // Update other metrics
    this.analysisMetrics.propertyTypes.add(data.propertyType);
    this.analysisMetrics.daysOnMarket.push(data.daysOnMarket);
  }

  // Enhanced comparison method for comps
  compareToPrimary(card) {
    if (!this.primaryCard) return null;

    const master = this.primaryCard.data;
    const comp = card.data;

    return {
      // Price comparisons
      priceDiff: comp.price - master.price,
      priceDiffPercent: ((comp.price - master.price) / master.price * 100).toFixed(2),
      
      // Size comparisons
      sqftDiff: comp.sqft - master.sqft,
      sqftDiffPercent: ((comp.sqft - master.sqft) / master.sqft * 100).toFixed(2),
      
      // Price per sqft comparison
      pricePerSqftDiff: comp.pricePerSqft - master.pricePerSqft,
      pricePerSqftDiffPercent: ((comp.pricePerSqft - master.pricePerSqft) / master.pricePerSqft * 100).toFixed(2),
      
      // Age comparison
      ageDiff: (new Date().getFullYear() - comp.yearBuilt) - (new Date().getFullYear() - master.yearBuilt),
      
      // Feature comparisons
      bedsDiff: comp.beds - master.beds,
      bathsDiff: comp.baths - master.baths,
      
      // Market timing
      daysOnMarketDiff: comp.daysOnMarket - master.daysOnMarket,
      
      // Score calculation (0-100)
      comparabilityScore: this.calculateComparabilityScore(master, comp)
    };
  }

  calculateComparabilityScore(master, comp) {
    // Use our revolutionary scoring engine instead of basic algorithm
    const result = this.scoringEngine.calculateScore(master, comp);
    
    // Log the breakdown for transparency
    console.log('[COMPS.RED] Score breakdown:', {
      address: comp.address,
      totalScore: result.score,
      breakdown: result.breakdown
    });
    
    return result.score;
  }

  // Generate comprehensive analysis
  generateAnalysis() {
    if (this.cards.length === 0) return null;

    const comparables = this.cards.filter(card => !card.isMaster);
    
    // Calculate suggested value for master property
    const suggestedValue = this.calculateSuggestedValue();
    
    return {
      summary: {
        totalCards: this.cards.length,
        comparableCount: comparables.length,
        averagePrice: this.calculateAverage('price'),
        averagePricePerSqft: this.calculateAverage('pricePerSqft'),
        medianPrice: this.calculateMedian('price'),
        suggestedValue: suggestedValue
      },
      
      ranges: {
        price: this.analysisMetrics.priceRange,
        sqft: this.analysisMetrics.sqftRange,
        pricePerSqft: this.analysisMetrics.pricePerSqftRange
      },
      
      marketInsights: {
        averageDaysOnMarket: this.calculateAverage('daysOnMarket'),
        propertyTypes: Array.from(this.analysisMetrics.propertyTypes),
        marketTrend: this.determineMarketTrend()
      },
      
      recommendations: this.generateRecommendations(suggestedValue)
    };
  }

  calculateSuggestedValue() {
    if (!this.primaryCard || this.cards.length < 2) return null;

    const comparables = this.cards.filter(card => !card.isMaster);
    const weights = comparables.map(card => card.comparisonToPrimary.comparabilityScore / 100);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    // Weighted average based on comparability scores
    const weightedPricePerSqft = comparables.reduce((sum, card, index) => {
      return sum + (card.data.pricePerSqft * weights[index]);
    }, 0) / totalWeight;
    
    return Math.round(weightedPricePerSqft * this.primaryCard.data.sqft);
  }

  calculateMedian(field) {
    const values = this.cards.map(card => card.data[field]).filter(v => v != null).sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  }

  determineMarketTrend() {
    // Analyze price trends based on listing dates
    const recentListings = this.cards.filter(card => {
      const listDate = new Date(card.data.listDate);
      const monthsAgo = (new Date() - listDate) / (1000 * 60 * 60 * 24 * 30);
      return monthsAgo <= 6;
    });

    if (recentListings.length < 3) return 'insufficient data';

    const avgOldPrice = this.calculateAverage('price');
    const avgRecentPrice = recentListings.reduce((sum, card) => sum + card.data.price, 0) / recentListings.length;
    const trend = ((avgRecentPrice - avgOldPrice) / avgOldPrice) * 100;

    if (trend > 5) return 'appreciating';
    if (trend < -5) return 'depreciating';
    return 'stable';
  }

  generateRecommendations(suggestedValue) {
    const recommendations = [];
    
    if (!this.primaryCard) return recommendations;

    const askingPrice = this.primaryCard.data.price;
    const priceDiff = suggestedValue - askingPrice;
    const priceDiffPercent = (priceDiff / askingPrice) * 100;

    if (priceDiffPercent > 10) {
      recommendations.push({
        type: 'overpriced',
        message: `Property appears overpriced by ${Math.abs(priceDiffPercent).toFixed(1)}%`,
        suggestedAction: `Consider offering $${suggestedValue.toLocaleString()}`
      });
    } else if (priceDiffPercent < -10) {
      recommendations.push({
        type: 'underpriced',
        message: `Property appears underpriced by ${Math.abs(priceDiffPercent).toFixed(1)}%`,
        suggestedAction: 'Act quickly - this is a potential deal'
      });
    } else {
      recommendations.push({
        type: 'fair',
        message: 'Property is priced within market range',
        suggestedAction: `Fair offer range: $${(suggestedValue * 0.95).toLocaleString()} - $${(suggestedValue * 1.02).toLocaleString()}`
      });
    }

    return recommendations;
  }

  // Export with enhanced comp analysis
  exportDeck(format = 'json') {
    const analysis = this.generateAnalysis();
    const exportData = {
      deckInfo: {
        type: 'COMPS.RED Comparable Analysis',
        created: new Date().toISOString(),
        analyst: 'COMPS.RED Platform'
      },
      subject: this.primaryCard,
      comparables: this.cards.filter(card => !card.isMaster).map(card => ({
        ...card,
        comparison: card.comparisonToPrimary
      })),
      analysis: analysis,
      disclaimer: 'This analysis is for informational purposes only. Consult with a real estate professional for investment decisions.'
    };

    switch (format) {
      case 'csv':
        return this.exportAsCSV(exportData);
      case 'pdf':
        return this.exportAsPDF(exportData);
      default:
        return JSON.stringify(exportData, null, 2);
    }
  }

  exportAsCSV(data) {
    let csv = 'COMPS.RED - Comparable Analysis Report\n\n';
    
    // Subject property
    csv += 'SUBJECT PROPERTY\n';
    csv += this.propertyToCSVRow(data.subject, 'SUBJECT') + '\n\n';
    
    // Comparables
    csv += 'COMPARABLE PROPERTIES\n';
    csv += 'Type,Address,Price,$/SqFt,Beds,Baths,SqFt,Year,Days on Market,Comp Score,Price Diff,Price Diff %\n';
    
    data.comparables.forEach(comp => {
      const c = comp.data;
      const comparison = comp.comparison;
      csv += `${comp.label},"${c.address}",${c.price},${c.pricePerSqft},${c.beds},${c.baths},${c.sqft},${c.yearBuilt},${c.daysOnMarket},${comparison.comparabilityScore}%,${comparison.priceDiff},${comparison.priceDiffPercent}%\n`;
    });
    
    // Analysis summary
    csv += '\n\nANALYSIS SUMMARY\n';
    csv += `Suggested Value:,$${data.analysis.summary.suggestedValue}\n`;
    csv += `Average Comp Price:,$${Math.round(data.analysis.summary.averagePrice)}\n`;
    csv += `Average $/SqFt:,$${Math.round(data.analysis.summary.averagePricePerSqft)}\n`;
    csv += `Market Trend:,${data.analysis.marketInsights.marketTrend}\n`;
    
    return csv;
  }

  propertyToCSVRow(card, type) {
    const p = card.data;
    return `${type},"${p.address}",${p.price},${p.pricePerSqft},${p.beds},${p.baths},${p.sqft},${p.yearBuilt},${p.daysOnMarket}`;
  }

  exportAsPDF(data) {
    // Placeholder for PDF generation
    // In production, this would use a library like jsPDF
    return this.exportAsCSV(data);
  }
}

// Register the deck type
window.CompsDeck = CompsDeck;