/**
 * COMPS.RED - Truth Export System
 * Exports REAL comp analysis, not MLS fairy tales
 * Shows what actually matters from 250+ flips of experience
 */

class TruthExport {
  constructor() {
    this.exportFormats = ['pdf', 'csv', 'json', 'truth'];
  }

  /**
   * Generate a "Truth Report" that shows what REALLY matters
   */
  generateTruthReport(deck) {
    const analysis = deck.generateAnalysis();
    const primary = deck.primaryCard;
    const comps = deck.cards.filter(c => !c.isMaster);

    const report = {
      header: this.generateHeader(primary),
      executiveSummary: this.generateExecutiveSummary(primary, analysis),
      primaryProperty: this.generatePrimarySection(primary),
      comparables: this.generateComparablesSection(comps),
      truthAnalysis: this.generateTruthAnalysis(primary, comps, analysis),
      redFlags: this.generateRedFlagsSection(primary, comps),
      recommendations: this.generateRecommendations(analysis),
      footer: this.generateFooter()
    };

    return report;
  }

  generateHeader(primary) {
    return {
      title: "COMPS.RED Truth Report",
      subtitle: "Real Comparable Analysis - Not MLS Nonsense",
      propertyAddress: primary.data.address,
      reportDate: new Date().toLocaleDateString(),
      disclaimer: "Based on actual market factors that matter, not arbitrary radius searches"
    };
  }

  generateExecutiveSummary(primary, analysis) {
    const suggestedValue = analysis.summary.suggestedValue;
    const askingPrice = primary.data.price;
    const difference = suggestedValue - askingPrice;
    const percentDiff = (difference / askingPrice * 100).toFixed(1);

    return {
      askingPrice: askingPrice,
      suggestedValue: suggestedValue,
      difference: difference,
      percentDifference: percentDiff,
      marketPosition: this.getMarketPosition(percentDiff),
      bottomLine: this.getBottomLine(percentDiff)
    };
  }

  getMarketPosition(percentDiff) {
    if (percentDiff > 10) return "OVERPRICED - Seller is dreaming";
    if (percentDiff > 5) return "Slightly overpriced - Room to negotiate";
    if (percentDiff > -5) return "FAIR MARKET VALUE - Priced right";
    if (percentDiff > -10) return "Good deal - Move fast";
    return "STEAL - Something might be wrong, investigate!";
  }

  getBottomLine(percentDiff) {
    if (percentDiff > 10) {
      return "Walk away unless you can get 10%+ off asking";
    } else if (percentDiff > 0) {
      return `Offer ${Math.abs(percentDiff).toFixed(0)}% below asking`;
    } else if (percentDiff > -5) {
      return "Offer asking price or slightly below";
    } else {
      return "Offer FULL PRICE immediately - this won't last";
    }
  }

  generatePrimarySection(primary) {
    const data = primary.data;
    
    return {
      title: "Subject Property Analysis",
      basics: {
        address: data.address,
        price: `$${data.price.toLocaleString()}`,
        pricePerSqft: `$${data.pricePerSqft}`,
        beds: data.beds,
        baths: data.baths,
        sqft: data.sqft.toLocaleString(),
        yearBuilt: data.yearBuilt,
        daysOnMarket: data.daysOnMarket
      },
      warnings: this.getPropertyWarnings(data),
      strengths: this.getPropertyStrengths(data)
    };
  }

  getPropertyWarnings(data) {
    const warnings = [];
    
    if (data.baths < 2) {
      warnings.push("⚠️ SINGLE BATHROOM - Major value limitation");
    }
    
    if (data.daysOnMarket > 90) {
      warnings.push("📅 STALE LISTING - 90+ days = hidden problems");
    }
    
    if (data.monthlyHoaFee > 300) {
      warnings.push(`💸 HIGH HOA - $${data.monthlyHoaFee}/month bleeds cash flow`);
    }
    
    if (!data.garageSpaces || data.garageSpaces === 0) {
      warnings.push("🚗 NO GARAGE - Significant value hit in most markets");
    }
    
    return warnings;
  }

  getPropertyStrengths(data) {
    const strengths = [];
    
    if (data.garageSpaces >= 2) {
      strengths.push(`✅ ${data.garageSpaces}-car garage`);
    }
    
    if (data.yearBuilt > new Date().getFullYear() - 10) {
      strengths.push("✅ Newer construction");
    }
    
    if (data.baths >= data.beds) {
      strengths.push("✅ Excellent bed/bath ratio");
    }
    
    if (data.daysOnMarket < 7) {
      strengths.push("🔥 NEW LISTING - Act fast!");
    }
    
    return strengths;
  }

  generateComparablesSection(comps) {
    return {
      title: "Comparable Properties Analysis",
      totalComps: comps.length,
      comparables: comps.map(comp => ({
        address: comp.data.address,
        score: comp.comparisonToPrimary.comparabilityScore,
        isTwin: comp.comparisonToPrimary.comparabilityScore >= 90,
        price: comp.data.price,
        pricePerSqft: comp.data.pricePerSqft,
        priceDiff: comp.comparisonToPrimary.priceDiff,
        priceDiffPercent: comp.comparisonToPrimary.priceDiffPercent,
        keyDifferences: this.getKeyDifferences(comp)
      }))
    };
  }

  getKeyDifferences(comp) {
    const diffs = [];
    const comparison = comp.comparisonToPrimary;
    
    if (Math.abs(comparison.bedsDiff) > 0) {
      diffs.push(`${comparison.bedsDiff > 0 ? '+' : ''}${comparison.bedsDiff} beds`);
    }
    
    if (Math.abs(comparison.bathsDiff) > 0) {
      diffs.push(`${comparison.bathsDiff > 0 ? '+' : ''}${comparison.bathsDiff} baths`);
    }
    
    if (Math.abs(comparison.sqftDiffPercent) > 10) {
      diffs.push(`${comparison.sqftDiffPercent > 0 ? '+' : ''}${comparison.sqftDiffPercent}% size`);
    }
    
    if (Math.abs(comparison.ageDiff) > 10) {
      diffs.push(`${comparison.ageDiff > 0 ? '+' : ''}${comparison.ageDiff} years age`);
    }
    
    return diffs;
  }

  generateTruthAnalysis(primary, comps, analysis) {
    // Find twins
    const twins = comps.filter(c => c.comparisonToPrimary.comparabilityScore >= 90);
    const perfectTwins = twins.filter(c => c.comparisonToPrimary.comparabilityScore >= 95);
    
    return {
      title: "The TRUTH About This Property",
      twinAnalysis: {
        foundTwins: twins.length > 0,
        twinCount: twins.length,
        perfectTwinCount: perfectTwins.length,
        twinPriceRange: this.getPriceRange(twins),
        insight: this.getTwinInsight(primary, twins)
      },
      marketTruth: {
        trend: analysis.marketInsights.marketTrend,
        avgDaysOnMarket: analysis.marketInsights.averageDaysOnMarket,
        insight: this.getMarketInsight(analysis)
      },
      pricingTruth: {
        suggestedValue: analysis.summary.suggestedValue,
        confidence: this.getConfidenceLevel(comps),
        negotiationPower: this.getNegotiationPower(primary, analysis)
      }
    };
  }

  getTwinInsight(primary, twins) {
    if (twins.length === 0) {
      return "No true twins found - pricing confidence is lower";
    } else if (twins.length === 1) {
      return "Found 1 twin property - good pricing indicator";
    } else {
      return `Found ${twins.length} twin properties - EXCELLENT pricing confidence`;
    }
  }

  getMarketInsight(analysis) {
    const trend = analysis.marketInsights.marketTrend;
    const avgDays = analysis.marketInsights.averageDaysOnMarket;
    
    if (trend === 'appreciating' && avgDays < 30) {
      return "HOT MARKET - Properties selling fast and prices rising";
    } else if (trend === 'stable') {
      return "BALANCED MARKET - Fair negotiations possible";
    } else {
      return "COOLING MARKET - Buyers have negotiation power";
    }
  }

  getConfidenceLevel(comps) {
    const goodComps = comps.filter(c => c.comparisonToPrimary.comparabilityScore >= 80);
    
    if (goodComps.length >= 5) return "HIGH";
    if (goodComps.length >= 3) return "MEDIUM";
    return "LOW";
  }

  getNegotiationPower(primary, analysis) {
    const daysOnMarket = primary.data.daysOnMarket;
    const marketTrend = analysis.marketInsights.marketTrend;
    
    if (daysOnMarket > 60) return "HIGH - Seller is motivated";
    if (daysOnMarket > 30 && marketTrend !== 'appreciating') return "MODERATE - Room to negotiate";
    if (marketTrend === 'appreciating') return "LOW - Seller's market";
    return "MODERATE - Standard negotiations";
  }

  generateRedFlagsSection(primary, comps) {
    const flags = [];
    
    // Check primary property red flags
    if (primary.data.daysOnMarket > 90) {
      flags.push({
        type: "STALE_LISTING",
        severity: "HIGH",
        message: "90+ days on market - investigate why it hasn't sold"
      });
    }
    
    // Check comp patterns
    const avgCompPrice = comps.reduce((sum, c) => sum + c.data.price, 0) / comps.length;
    if (primary.data.price > avgCompPrice * 1.15) {
      flags.push({
        type: "OVERPRICED",
        severity: "HIGH",
        message: "Priced 15%+ above comparable properties"
      });
    }
    
    return {
      title: "Red Flags & Warnings",
      flagCount: flags.length,
      flags: flags
    };
  }

  generateRecommendations(analysis) {
    const recs = analysis.recommendations || [];
    
    return {
      title: "Action Recommendations",
      primary: recs[0] || { message: "Proceed with standard due diligence" },
      additional: [
        "Get a thorough inspection focusing on water damage",
        "Check for unpermitted additions",
        "Verify property tax assessments",
        "Research any HOA litigation or special assessments"
      ]
    };
  }

  generateFooter() {
    return {
      generatedBy: "COMPS.RED - Real Estate Truth Engine",
      disclaimer: "This analysis is based on real market factors. Always verify with your own due diligence.",
      tagline: "Saving you from 5-6% commissions, one truth at a time",
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Export to CSV format
   */
  exportToCSV(report) {
    let csv = "COMPS.RED Truth Report\n";
    csv += `Generated: ${report.footer.timestamp}\n\n`;
    
    csv += "EXECUTIVE SUMMARY\n";
    csv += `Asking Price,${report.executiveSummary.askingPrice}\n`;
    csv += `Suggested Value,${report.executiveSummary.suggestedValue}\n`;
    csv += `Difference,${report.executiveSummary.difference}\n`;
    csv += `Market Position,${report.executiveSummary.marketPosition}\n`;
    csv += `Recommendation,${report.executiveSummary.bottomLine}\n\n`;
    
    csv += "COMPARABLE PROPERTIES\n";
    csv += "Address,Score,Twin,Price,$/SqFt,Price Diff,Price Diff %\n";
    
    report.comparables.comparables.forEach(comp => {
      csv += `"${comp.address}",${comp.score},${comp.isTwin ? 'YES' : 'NO'},`;
      csv += `${comp.price},${comp.pricePerSqft},${comp.priceDiff},${comp.priceDiffPercent}%\n`;
    });
    
    return csv;
  }

  /**
   * Utility functions
   */
  getPriceRange(properties) {
    if (properties.length === 0) return { min: 0, max: 0 };
    
    const prices = properties.map(p => p.data.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
}

// Export for use
window.TruthExport = TruthExport;