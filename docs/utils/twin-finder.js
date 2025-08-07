/**
 * COMPS.RED - Twin Finder Algorithm
 * Finds IDENTICAL properties, not just "similar" ones
 * Based on 250+ flips worth of real wisdom
 */

class TwinFinder {
  constructor() {
    // Factors that make properties "twins"
    this.twinFactors = {
      // Must match exactly
      exactMatch: [
        'propertyType',
        'beds',
        'baths',
        'yearBuilt' // Within 5 years counts as match
      ],
      // Should be very close
      closeMatch: [
        'sqft', // Within 5%
        'lotSize' // Within 10%
      ],
      // Location matching (most important)
      locationMatch: [
        'sameStreet',
        'sameSubdivision',
        'sameBuilder'
      ]
    };
  }

  /**
   * Find the best twin properties from a list of comparables
   * Returns sorted list with twin scores
   */
  findTwins(subject, comparables) {
    const scoredComps = comparables.map(comp => {
      const twinScore = this.calculateTwinScore(subject, comp);
      return {
        ...comp,
        twinScore: twinScore,
        isTwin: twinScore >= 90,
        isPerfectTwin: twinScore >= 95
      };
    });

    // Sort by twin score descending
    return scoredComps.sort((a, b) => b.twinScore - a.twinScore);
  }

  /**
   * Calculate how "twin-like" two properties are
   * 100 = Perfect twin (same model, same street)
   * 90+ = Excellent twin (same model, nearby)
   * 80+ = Good match (very similar)
   * <80 = Not a twin
   */
  calculateTwinScore(subject, comp) {
    let score = 100;
    
    // EXACT MATCHES (Critical)
    // Property type must match
    if (subject.propertyType !== comp.propertyType) {
      return 0; // Not even comparable
    }

    // Bed/bath must match for true twins
    if (subject.beds !== comp.beds) {
      score -= 20;
    }
    if (subject.baths !== comp.baths) {
      score -= 15;
    }

    // Year built (within 5 years for same builder/materials)
    const yearDiff = Math.abs(subject.yearBuilt - comp.yearBuilt);
    if (yearDiff > 5) {
      score -= Math.min(20, yearDiff - 5);
    }

    // CLOSE MATCHES
    // Square footage (within 5% for true twin)
    const sqftDiff = Math.abs(comp.sqft - subject.sqft) / subject.sqft;
    if (sqftDiff > 0.05) {
      score -= Math.min(15, sqftDiff * 100);
    }

    // Lot size (within 10%)
    if (subject.lotSize && comp.lotSize) {
      const lotDiff = Math.abs(comp.lotSize - subject.lotSize) / subject.lotSize;
      if (lotDiff > 0.10) {
        score -= Math.min(10, lotDiff * 50);
      }
    }

    // LOCATION MATCHING (Most important for twins)
    const locationScore = this.calculateLocationScore(subject, comp);
    
    // If same street, huge bonus
    if (locationScore.sameStreet) {
      score += 10; // Can exceed 100 for perfect twins
    } else if (locationScore.distance > 0.5) {
      score -= Math.min(20, locationScore.distance * 10);
    }

    // Same subdivision/builder bonus
    if (locationScore.sameSubdivision) {
      score += 5;
    }

    // Floor plan matching (if we can detect)
    if (this.isSameFloorPlan(subject, comp)) {
      score += 15; // Major bonus for identical floor plans
    }

    return Math.max(0, Math.min(110, score)); // Can go to 110 for super twins
  }

  /**
   * Calculate location matching score
   */
  calculateLocationScore(subject, comp) {
    const score = {
      sameStreet: false,
      sameSubdivision: false,
      distance: 0
    };

    // Check if same street
    const subjectStreet = this.extractStreetName(subject.address);
    const compStreet = this.extractStreetName(comp.address);
    score.sameStreet = subjectStreet === compStreet;

    // Check subdivision (if available)
    if (subject.subdivision && comp.subdivision) {
      score.sameSubdivision = subject.subdivision === comp.subdivision;
    }

    // Calculate distance (simplified for now)
    // In production, would use geocoding
    score.distance = score.sameStreet ? 0.1 : 0.5;

    return score;
  }

  /**
   * Detect if two properties have the same floor plan
   * This is GOLD for track homes
   */
  isSameFloorPlan(subject, comp) {
    // Exact match on key metrics suggests same floor plan
    if (subject.sqft === comp.sqft && 
        subject.beds === comp.beds && 
        subject.baths === comp.baths &&
        Math.abs(subject.yearBuilt - comp.yearBuilt) <= 5) {
      return true;
    }

    // Within 50 sqft and same bed/bath likely same plan
    if (Math.abs(subject.sqft - comp.sqft) <= 50 &&
        subject.beds === comp.beds && 
        subject.baths === comp.baths) {
      return true;
    }

    return false;
  }

  /**
   * Extract street name from address
   */
  extractStreetName(address) {
    if (!address) return '';
    
    // Remove house number and city/state
    const parts = address.split(',')[0].split(' ');
    
    // Skip the number, return the street name
    return parts.slice(1).join(' ').toLowerCase().trim();
  }

  /**
   * Find properties that back to same features (railroad, freeway, etc.)
   * These are the BEST comps even if they seem "bad"
   */
  findBackingMatches(subject, comparables, backingFeature) {
    return comparables.filter(comp => {
      // If both back to same "negative" feature, that's actually PERFECT
      return comp.backingFeature === backingFeature;
    });
  }

  /**
   * Group properties by model/floor plan for track homes
   */
  groupByModel(properties) {
    const models = {};
    
    properties.forEach(prop => {
      const modelKey = `${prop.beds}_${prop.baths}_${Math.round(prop.sqft/100)*100}`;
      
      if (!models[modelKey]) {
        models[modelKey] = {
          modelName: modelKey,
          properties: [],
          avgPrice: 0,
          avgPricePerSqft: 0
        };
      }
      
      models[modelKey].properties.push(prop);
    });

    // Calculate averages for each model
    Object.values(models).forEach(model => {
      const total = model.properties.reduce((sum, p) => sum + p.price, 0);
      model.avgPrice = total / model.properties.length;
      
      const totalPPSF = model.properties.reduce((sum, p) => sum + (p.price/p.sqft), 0);
      model.avgPricePerSqft = totalPPSF / model.properties.length;
    });

    return models;
  }
}

// Export for use
window.TwinFinder = TwinFinder;