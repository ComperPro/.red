/**
 * COMPS.RED - Advanced Card Renderer
 * Shows the REAL scoring breakdown, not MLS fairy tales
 */

class CardRenderer {
  static renderScoreBreakdown(card) {
    if (!card.comparisonToPrimary || !card.scoreBreakdown) {
      return '';
    }

    const breakdown = card.scoreBreakdown;
    const comparison = card.comparisonToPrimary;

    // Create visual score bars
    const createScoreBar = (label, score, maxScore = 100) => {
      const percentage = (score / maxScore) * 100;
      const colorClass = percentage >= 80 ? 'excellent' : 
                        percentage >= 60 ? 'good' : 
                        percentage >= 40 ? 'fair' : 'poor';
      
      return `
        <div class="score-item">
          <div class="score-label">${label}</div>
          <div class="score-bar">
            <div class="score-fill ${colorClass}" style="width: ${percentage}%"></div>
          </div>
          <div class="score-value">${score}</div>
        </div>
      `;
    };

    // Detect red flags
    const redFlagsHtml = breakdown.redFlags && breakdown.redFlags.length > 0 ? `
      <div class="red-flags-section">
        <h4>🚨 Red Flags Detected:</h4>
        <ul class="red-flags-list">
          ${breakdown.redFlags.map(flag => `
            <li class="red-flag-item">${flag.type}: ${flag.impact} points</li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    // Detect value bombs
    const valueBombsHtml = breakdown.valueBombs && breakdown.valueBombs.length > 0 ? `
      <div class="value-bombs-section">
        <h4>💎 Value Features:</h4>
        <ul class="value-bombs-list">
          ${breakdown.valueBombs.map(bomb => `
            <li class="value-bomb-item">${bomb.type}: +${bomb.impact} points</li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    return `
      <div class="advanced-scoring-section">
        <h3>🎯 True Comparability Analysis</h3>
        
        <div class="score-breakdown">
          ${createScoreBar('Location Match', breakdown.location || 0)}
          ${createScoreBar('Structure Match', breakdown.structure || 0)}
          ${createScoreBar('Condition Match', breakdown.condition || 0)}
          ${createScoreBar('Features Match', breakdown.features || 0)}
        </div>

        <div class="comparison-insights">
          <div class="insight-grid">
            <div class="insight-item">
              <span class="insight-label">Price Difference:</span>
              <span class="insight-value ${comparison.priceDiff > 0 ? 'higher' : 'lower'}">
                ${comparison.priceDiff > 0 ? '+' : ''}$${Math.abs(comparison.priceDiff).toLocaleString()}
              </span>
            </div>
            <div class="insight-item">
              <span class="insight-label">$/SqFt Difference:</span>
              <span class="insight-value">
                ${comparison.pricePerSqftDiff > 0 ? '+' : ''}$${Math.abs(comparison.pricePerSqftDiff)}
              </span>
            </div>
            <div class="insight-item">
              <span class="insight-label">Size Difference:</span>
              <span class="insight-value">
                ${comparison.sqftDiff > 0 ? '+' : ''}${comparison.sqftDiff} sqft
              </span>
            </div>
            <div class="insight-item">
              <span class="insight-label">Age Difference:</span>
              <span class="insight-value">
                ${comparison.ageDiff > 0 ? '+' : ''}${comparison.ageDiff} years
              </span>
            </div>
          </div>
        </div>

        ${redFlagsHtml}
        ${valueBombsHtml}

        <div class="score-explanation">
          <p class="explanation-text">
            This score uses REAL factors that matter, not the "dumb radius" method agents use.
            We analyze location specifics, structural similarities, condition indicators, and value-affecting features.
          </p>
        </div>
      </div>
    `;
  }

  static renderComparisonBadges(comparison) {
    if (!comparison) return '';

    const badges = [];

    // Twin detection
    if (comparison.comparabilityScore >= 95) {
      badges.push('<span class="badge badge-twin">🏠 TWIN PROPERTY</span>');
    }

    // Same street bonus
    if (comparison.sameStreet) {
      badges.push('<span class="badge badge-location">📍 SAME STREET</span>');
    }

    // Price indicator
    if (Math.abs(comparison.priceDiffPercent) <= 5) {
      badges.push('<span class="badge badge-price">💰 SIMILAR PRICE</span>');
    }

    // Market timing
    if (comparison.daysOnMarketDiff > 30) {
      badges.push('<span class="badge badge-stale">⏰ STALE LISTING</span>');
    }

    return badges.length > 0 ? `
      <div class="comparison-badges">
        ${badges.join('')}
      </div>
    ` : '';
  }

  static renderPropertyHighlights(data) {
    const highlights = [];

    // Check for single bathroom (value killer)
    if (data.baths < 2) {
      highlights.push('<span class="highlight highlight-warning">⚠️ Single Bathroom</span>');
    }

    // Check for garage
    if (data.garageSpaces && data.garageSpaces > 0) {
      highlights.push(`<span class="highlight highlight-positive">🚗 ${data.garageSpaces} Car Garage</span>`);
    }

    // Days on market indicator
    if (data.daysOnMarket > 90) {
      highlights.push('<span class="highlight highlight-warning">📅 90+ Days Listed</span>');
    } else if (data.daysOnMarket < 7) {
      highlights.push('<span class="highlight highlight-hot">🔥 New Listing</span>');
    }

    // HOA warning
    if (data.monthlyHoaFee > 300) {
      highlights.push(`<span class="highlight highlight-warning">💸 HOA $${data.monthlyHoaFee}/mo</span>`);
    }

    return highlights.length > 0 ? `
      <div class="property-highlights">
        ${highlights.join('')}
      </div>
    ` : '';
  }
}

// Export for use
window.CardRenderer = CardRenderer;