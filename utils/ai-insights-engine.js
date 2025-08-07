/**
 * COMPS.RED - AI Insights Engine
 * Revolutionary AI-powered market analysis based on 250+ flip experience
 */

class AIInsightsEngine {
  constructor() {
    this.flipExperience = {
      totalFlips: 250,
      averageProfit: 45000,
      successRate: 0.78,
      marketKnowledge: 'veteran'
    };
  }

  analyzeMarketTrend(analysis) {
    if (!analysis?.marketInsights) {
      return {
        direction: 'Unknown',
        analysis: 'Insufficient data for trend analysis'
      };
    }

    const trend = analysis.marketInsights.marketTrend;
    const avgDOM = analysis.marketInsights.averageDaysOnMarket;

    if (trend === 'appreciating') {
      return {
        direction: '📈 Rising',
        analysis: `Market showing strong appreciation. Average ${avgDOM} days on market suggests healthy demand.`
      };
    } else if (trend === 'depreciating') {
      return {
        direction: '📉 Declining', 
        analysis: `Market showing weakness. ${avgDOM} days on market indicates buyer hesitation.`
      };
    } else {
      return {
        direction: '➡️ Stable',
        analysis: `Market balanced. ${avgDOM} days typical for this area.`
      };
    }
  }

  analyzeDealQuality(primary, analysis) {
    if (!primary || !analysis) {
      return { icon: '❓', score: 0, level: 'unknown', analysis: 'Insufficient data' };
    }

    const suggestedValue = analysis.summary?.suggestedValue || 0;
    const askingPrice = primary.data.price;
    const discount = ((askingPrice - suggestedValue) / suggestedValue) * 100;

    let score, level, icon, analysisText;

    if (discount < -20) {
      score = 9; level = 'excellent'; icon = '💎';
      analysisText = 'EXCEPTIONAL DEAL! Property significantly underpriced - move fast!';
    } else if (discount < -10) {
      score = 7; level = 'good'; icon = '👍';
      analysisText = 'Good value opportunity with solid profit potential.';
    } else if (discount < 5) {
      score = 5; level = 'fair'; icon = '⚖️';
      analysisText = 'Fair market pricing - standard investment opportunity.';
    } else {
      score = 2; level = 'poor'; icon = '⚠️';
      analysisText = 'Overpriced based on comparables - negotiate or walk away.';
    }

    return { icon, score, level, analysis: analysisText };
  }

  identifyRiskFactors(primary, comparables) {
    const risks = [];

    if (!primary) return risks;

    const data = primary.data;

    // Age-related risks
    const age = new Date().getFullYear() - data.yearBuilt;
    if (age > 50) {
      risks.push({
        severity: 'high',
        description: `Property is ${age} years old - expect major system replacements`
      });
    }

    // Market time risk
    if (data.daysOnMarket > 90) {
      risks.push({
        severity: 'medium',
        description: `${data.daysOnMarket} days on market suggests pricing or condition issues`
      });
    }

    // HOA risk
    if (data.monthlyHoaFee > 300) {
      risks.push({
        severity: 'medium',
        description: `High HOA fees ($${data.monthlyHoaFee}/mo) impact resale appeal`
      });
    }

    // Comparable consistency
    if (comparables.length < 3) {
      risks.push({
        severity: 'medium',
        description: 'Limited comparable data - valuation confidence reduced'
      });
    }

    // Default risk if none found
    if (risks.length === 0) {
      risks.push({
        severity: 'low',
        description: 'No major red flags identified in initial analysis'
      });
    }

    return risks.slice(0, 5); // Limit to top 5 risks
  }

  identifyOpportunities(primary, comparables) {
    const opportunities = [];

    if (!primary) return opportunities;

    const data = primary.data;

    // Quick flip opportunity
    if (data.daysOnMarket < 14) {
      opportunities.push({
        description: 'Fresh listing - less competition from other investors'
      });
    }

    // Renovation potential
    const age = new Date().getFullYear() - data.yearBuilt;
    if (age > 20 && age < 60) {
      opportunities.push({
        description: 'Prime age for value-add renovations and modernization'
      });
    }

    // Size advantage
    if (data.sqft > 2000) {
      opportunities.push({
        description: 'Larger home appeals to families - strong resale market'
      });
    }

    // Bathroom upgrade potential
    if (data.baths < 2.5 && data.beds >= 3) {
      opportunities.push({
        description: 'Add bathroom to significantly increase value'
      });
    }

    // Market positioning
    const avgPrice = comparables.reduce((sum, comp) => sum + comp.data.price, 0) / comparables.length;
    if (data.price < avgPrice * 0.9) {
      opportunities.push({
        description: 'Priced below comparable average - negotiation power'
      });
    }

    // Default opportunity
    if (opportunities.length === 0) {
      opportunities.push({
        description: 'Standard investment opportunity - follow proven renovation formula'
      });
    }

    return opportunities.slice(0, 4); // Limit to top 4 opportunities
  }

  generatePriceRecommendation(analysis) {
    const suggestedValue = analysis?.summary?.suggestedValue || 0;
    
    if (suggestedValue === 0) {
      return {
        conservative: 'N/A',
        aggressive: 'N/A', 
        sweetSpot: 'N/A'
      };
    }

    // Based on 70% rule and flip experience
    const conservative = Math.round(suggestedValue * 0.65);
    const aggressive = Math.round(suggestedValue * 0.75);
    const sweetSpot = Math.round(suggestedValue * 0.70);

    return {
      conservative: `$${conservative.toLocaleString()}`,
      aggressive: `$${aggressive.toLocaleString()}`,
      sweetSpot: `$${sweetSpot.toLocaleString()}`
    };
  }

  assessFlipPotential(primary, analysis) {
    if (!primary || !analysis?.summary?.suggestedValue) {
      return {
        profit: 'Unknown',
        analysis: 'Insufficient data for flip analysis'
      };
    }

    const purchasePrice = primary.data.price;
    const afterRepairValue = analysis.summary.suggestedValue;
    const estimatedRenovation = Math.round(primary.data.sqft * 25); // $25/sqft average
    const holdingCosts = Math.round(purchasePrice * 0.05);
    const sellingCosts = Math.round(afterRepairValue * 0.08);
    
    const totalCosts = purchasePrice + estimatedRenovation + holdingCosts + sellingCosts;
    const profit = afterRepairValue - totalCosts;

    if (profit > 50000) {
      return {
        profit: `$${Math.round(profit/1000)}K profit`,
        analysis: 'Excellent flip potential - well above minimum profit threshold'
      };
    } else if (profit > 25000) {
      return {
        profit: `$${Math.round(profit/1000)}K profit`,
        analysis: 'Good flip opportunity - meets veteran investor standards'
      };
    } else if (profit > 10000) {
      return {
        profit: `$${Math.round(profit/1000)}K profit`,
        analysis: 'Marginal deal - consider only if perfect execution possible'
      };
    } else {
      return {
        profit: `$${Math.round(profit/1000)}K loss risk`,
        analysis: 'Poor flip candidate - renovation costs likely exceed profit'
      };
    }
  }

  estimateTimeToSell(primary, comparables) {
    if (!primary) {
      return {
        estimate: 'Unknown',
        analysis: 'Insufficient data'
      };
    }

    const avgDaysOnMarket = comparables.length > 0 
      ? comparables.reduce((sum, comp) => sum + comp.data.daysOnMarket, 0) / comparables.length
      : 60; // Default

    const priceRange = this.categorizePrice(primary.data.price);
    
    let estimate, analysisText;

    if (avgDaysOnMarket < 30) {
      estimate = '2-4 weeks';
      analysisText = `Hot market with ${Math.round(avgDaysOnMarket)} day average. Price ${priceRange} for quick sale.`;
    } else if (avgDaysOnMarket < 60) {
      estimate = '4-8 weeks';
      analysisText = `Normal market pace. ${priceRange} pricing strategy recommended.`;
    } else {
      estimate = '8-12 weeks';
      analysisText = `Slower market. ${priceRange} pricing and staging critical for sale.`;
    }

    return { estimate, analysis: analysisText };
  }

  assessCompetition(comparables) {
    const activeListings = comparables.filter(comp => 
      comp.data.listingStatus === 'FOR_SALE' || comp.data.daysOnMarket < 30
    ).length;

    if (activeListings === 0) {
      return 'Low - Limited inventory favors sellers';
    } else if (activeListings < 3) {
      return 'Moderate - Balanced market conditions';
    } else {
      return 'High - Buyer market with multiple options';
    }
  }

  categorizePrice(price) {
    if (price < 200000) return 'starter home';
    if (price < 400000) return 'mid-market';
    if (price < 800000) return 'move-up buyer';
    return 'luxury segment';
  }
}

// Export for use in main application
window.AIInsightsEngine = AIInsightsEngine;
