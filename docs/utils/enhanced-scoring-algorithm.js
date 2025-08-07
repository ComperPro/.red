/**
 * COMPS.RED Enhanced Scoring Algorithm
 * Revolutionary comparability scoring based on REAL factors that matter
 * 
 * Built by someone who's flipped 250+ homes and knows what actually moves deals
 */

class EnhancedScoringEngine {
  constructor() {
    // Weights based on real-world impact
    this.weights = {
      location: 0.45,        // 45% - Location is KING
      structure: 0.25,       // 25% - Size, layout, rooms
      condition: 0.20,       // 20% - Age, updates, maintenance
      features: 0.10         // 10% - Amenities, extras
    };

    // Red flags that kill deals
    this.redFlags = {
      foundation_issues: -25,
      water_damage_history: -20,
      mold_problems: -20,
      power_lines_nearby: -15,
      flood_zone: -15,
      busy_road: -10,
      environmental_hazard: -30,
      structural_damage: -25,
      roof_issues: -15,
      hvac_failure: -10
    };

    // Value bombs that close deals
    this.valueBombs = {
      recent_kitchen_update: 15,
      recent_bathroom_update: 10,
      energy_efficient: 8,
      solar_panels: 10,
      pool_warm_climate: 7,
      finished_basement: 8,
      garage_spaces: 5,
      smart_home_features: 5,
      new_roof: 10,
      new_hvac: 8
    };
  }

  calculateScore(subject, comparable) {
    let score = 100; // Start perfect

    // LOCATION SCORING (45% weight)
    const locationScore = this.scoreLocation(subject, comparable);
    
    // STRUCTURE SCORING (25% weight)
    const structureScore = this.scoreStructure(subject, comparable);
    
    // CONDITION SCORING (20% weight)
    const conditionScore = this.scoreCondition(subject, comparable);
    
    // FEATURES SCORING (10% weight)
    const featuresScore = this.scoreFeatures(subject, comparable);

    // Weighted final score
    const weightedScore = 
      (locationScore * this.weights.location) +
      (structureScore * this.weights.structure) +
      (conditionScore * this.weights.condition) +
      (featuresScore * this.weights.features);

    // Apply red flags and value bombs
    const adjustedScore = this.applySpecialFactors(comparable, weightedScore);

    return {
      score: Math.max(0, Math.min(100, Math.round(adjustedScore))),
      breakdown: {
        location: Math.round(locationScore),
        structure: Math.round(structureScore),
        condition: Math.round(conditionScore),
        features: Math.round(featuresScore),
        redFlags: this.detectRedFlags(comparable),
        valueBombs: this.detectValueBombs(comparable)
      }
    };
  }

  scoreLocation(subject, comp) {
    let score = 100;

    // Same street = jackpot
    if (this.sameStreet(subject.address, comp.address)) {
      return 100;
    }

    // Distance penalty (exponential decay)
    const distance = this.calculateDistance(subject, comp);
    if (distance > 0.1) score -= Math.min(50, distance * 10);

    // School district is HUGE for families
    if (subject.schools?.elementary !== comp.schools?.elementary) {
      score -= 20;
    }

    // Neighborhood factors
    if (subject.neighborhood !== comp.neighborhood) {
      score -= 15;
    }

    // Crime rate differences (when we have data)
    // TODO: Integrate crime API

    // Walkability differences (when we have data)
    // TODO: Integrate walkability scores

    return score;
  }

  scoreStructure(subject, comp) {
    let score = 100;

    // Square footage differences (most important)
    const sqftDiff = Math.abs(comp.sqft - subject.sqft) / subject.sqft;
    score -= Math.min(40, sqftDiff * 100);

    // Bedroom count (critical for families)
    const bedDiff = Math.abs(comp.beds - subject.beds);
    score -= bedDiff * 15;

    // Bathroom count
    const bathDiff = Math.abs(comp.baths - subject.baths);
    score -= bathDiff * 10;

    // Lot size (especially important in suburbs)
    if (subject.lotSize && comp.lotSize) {
      const lotDiff = Math.abs(comp.lotSize - subject.lotSize) / subject.lotSize;
      score -= Math.min(10, lotDiff * 20);
    }

    // Property type match
    if (subject.propertyType !== comp.propertyType) {
      score -= 20;
    }

    return score;
  }

  scoreCondition(subject, comp) {
    let score = 100;

    // Age difference (newer isn't always better)
    const ageDiff = Math.abs(comp.yearBuilt - subject.yearBuilt);
    if (ageDiff > 20) {
      score -= 20;
    } else if (ageDiff > 10) {
      score -= 10;
    }

    // Days on market (indicator of condition/pricing)
    if (comp.daysOnMarket > 90) {
      score -= 15; // Something's wrong if it sits this long
    }

    // Price per sqft variance (market indicator)
    const subjectPPSF = subject.price / subject.sqft;
    const compPPSF = comp.price / comp.sqft;
    const ppsfDiff = Math.abs(compPPSF - subjectPPSF) / subjectPPSF;
    score -= Math.min(25, ppsfDiff * 50);

    return score;
  }

  scoreFeatures(subject, comp) {
    let score = 80; // Start at 80, can go up or down

    // Garage comparison
    const garageDiff = (comp.garageSpaces || 0) - (subject.garageSpaces || 0);
    score += garageDiff * 5;

    // HOA fees (lower is better usually)
    if (subject.monthlyHoaFee && comp.monthlyHoaFee) {
      const hoaDiff = comp.monthlyHoaFee - subject.monthlyHoaFee;
      score -= Math.min(10, Math.abs(hoaDiff) / 50);
    }

    // Pool (market dependent)
    // TODO: Make this climate-aware

    return score;
  }

  applySpecialFactors(comp, baseScore) {
    let adjustedScore = baseScore;

    // Check for red flags
    const redFlags = this.detectRedFlags(comp);
    redFlags.forEach(flag => {
      adjustedScore += this.redFlags[flag.type] || 0;
    });

    // Check for value bombs
    const valueBombs = this.detectValueBombs(comp);
    valueBombs.forEach(bomb => {
      adjustedScore += this.valueBombs[bomb.type] || 0;
    });

    return adjustedScore;
  }

  detectRedFlags(property) {
    const flags = [];
    
    // These would be detected from description, images, or additional data
    // For now, we'll use placeholders
    
    // TODO: Implement ML-based detection from images
    // TODO: Parse descriptions for keywords
    // TODO: Integrate with external APIs

    return flags;
  }

  detectValueBombs(property) {
    const bombs = [];
    
    // These would be detected from updates, features, etc.
    // TODO: Parse for "recently updated", "new", etc.
    
    return bombs;
  }

  // Utility functions
  calculateDistance(subject, comp) {
    // Simple approximation for now
    // TODO: Integrate real geocoding
    return 0.5; // miles
  }

  sameStreet(address1, address2) {
    // Extract street name and compare
    const street1 = this.extractStreetName(address1);
    const street2 = this.extractStreetName(address2);
    return street1 === street2;
  }

  extractStreetName(address) {
    // Basic extraction - can be improved
    const parts = address.split(' ');
    return parts.slice(1, -1).join(' ').toLowerCase();
  }
}

// Export for use in comps-deck.js
window.EnhancedScoringEngine = EnhancedScoringEngine;