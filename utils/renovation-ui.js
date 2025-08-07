class RenovationUI {
  constructor(calculator) {
    this.calculator = calculator;
    this.currentEstimate = null;
  }

  createCalculatorHTML() {
    return `
      <div class="renovation-calculator">
        <div class="calc-header">
          <h2>🔨 Renovation Calculator</h2>
          <p class="calc-subtitle">Real costs from 250+ flips</p>
        </div>

        <div class="property-basics">
          <h3>Property Details</h3>
          <div class="input-row">
            <label>Square Footage</label>
            <input type="number" id="reno-sqft" value="1500" min="500" max="10000">
          </div>
          <div class="input-row">
            <label>Purchase Price</label>
            <input type="number" id="purchase-price" value="200000" step="5000">
          </div>
        </div>

        <div class="renovation-scope">
          <h3>Renovation Scope</h3>
          
          <div class="scope-section">
            <h4>Kitchen</h4>
            <select id="kitchen-level">
              <option value="none">No Work Needed</option>
              <option value="budget">Budget ($10K total)</option>
              <option value="standard" selected>Standard ($21K total)</option>
              <option value="premium">Premium ($53K total)</option>
            </select>
          </div>

          <div class="scope-section">
            <h4>Bathrooms</h4>
            <div class="input-row">
              <label>Number of Bathrooms</label>
              <input type="number" id="bathroom-count" value="2" min="0" max="6" step="0.5">
            </div>
            <select id="bathroom-level">
              <option value="none">No Work Needed</option>
              <option value="budget">Budget ($3.5K full/$2K half)</option>
              <option value="standard" selected>Standard ($7K full/$3.5K half)</option>
              <option value="premium">Premium ($15K full/$7.5K half)</option>
            </select>
          </div>

          <div class="scope-section">
            <h4>Flooring</h4>
            <div class="input-row">
              <label>Flooring Sqft</label>
              <input type="number" id="flooring-sqft" placeholder="Auto-calculate">
            </div>
            <select id="flooring-type">
              <option value="none">No Work Needed</option>
              <option value="carpet">Carpet ($3.50/sqft)</option>
              <option value="lvp" selected>LVP ($5/sqft)</option>
              <option value="laminate">Laminate ($4.50/sqft)</option>
              <option value="tile">Tile ($8/sqft)</option>
              <option value="hardwood">Hardwood ($8/sqft)</option>
            </select>
          </div>

          <div class="scope-section">
            <h4>Major Systems</h4>
            <div class="checkbox-group">
              <label><input type="checkbox" id="paint-needed" checked> Interior Paint</label>
              <label><input type="checkbox" id="roof-needed"> New Roof</label>
              <label><input type="checkbox" id="hvac-needed"> HVAC Replacement</label>
            </div>
          </div>

          <div class="scope-section">
            <h4>Electrical</h4>
            <select id="electrical-scope">
              <option value="none">No Work Needed</option>
              <option value="update" selected>Update ($3/sqft)</option>
              <option value="partial">Partial Rewire ($6/sqft)</option>
              <option value="rewire">Full Rewire + Panel ($10/sqft + $2K)</option>
            </select>
          </div>

          <div class="scope-section">
            <h4>Plumbing</h4>
            <select id="plumbing-scope">
              <option value="none">No Work Needed</option>
              <option value="update" selected>Update Fixtures ($500/fixture)</option>
              <option value="replace">Replace Fixtures ($1K/fixture)</option>
              <option value="repipe">Full Repipe ($2K/fixture)</option>
            </select>
          </div>

          <div class="scope-section">
            <h4>Exterior</h4>
            <div class="checkbox-group">
              <label><input type="checkbox" class="exterior-work" value="siding"> Siding</label>
              <label><input type="checkbox" class="exterior-work" value="windows"> Windows</label>
              <label><input type="checkbox" class="exterior-work" value="doors"> Doors</label>
              <label><input type="checkbox" class="exterior-work" value="deck"> Deck/Patio</label>
              <label><input type="checkbox" class="exterior-work" value="driveway"> Driveway</label>
              <label><input type="checkbox" class="exterior-work" value="landscaping"> Landscaping</label>
            </div>
          </div>

          <div class="scope-section">
            <h4>Demolition</h4>
            <select id="demolition-scope">
              <option value="none">No Demo Needed</option>
              <option value="surface" selected>Surface Level ($1/sqft)</option>
              <option value="selective">Selective ($3/sqft)</option>
              <option value="gutToStuds">Gut to Studs ($5/sqft)</option>
            </select>
          </div>
        </div>

        <button id="calculate-renovation" class="calculate-btn">Calculate Renovation Costs</button>

        <div id="renovation-results" class="results-section" style="display: none;">
          <h3>Cost Breakdown</h3>
          <div id="cost-breakdown"></div>
          
          <div class="summary-cards">
            <div class="summary-card">
              <h4>Investment Analysis</h4>
              <div id="investment-summary"></div>
            </div>
            
            <div class="summary-card">
              <h4>70% Rule Check</h4>
              <div id="seventy-rule"></div>
            </div>
          </div>

          <button id="export-renovation" class="export-btn">Export Renovation Plan</button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const calculateBtn = document.getElementById('calculate-renovation');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => this.calculateRenovation());
    }

    const exportBtn = document.getElementById('export-renovation');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportRenovation());
    }
  }

  calculateRenovation() {
    const sqft = parseInt(document.getElementById('reno-sqft').value) || 1500;
    const purchasePrice = parseInt(document.getElementById('purchase-price').value) || 200000;
    
    const kitchenLevel = document.getElementById('kitchen-level').value;
    const bathrooms = parseFloat(document.getElementById('bathroom-count').value) || 2;
    const bathroomLevel = document.getElementById('bathroom-level').value;
    const flooringSqft = parseInt(document.getElementById('flooring-sqft').value) || null;
    const flooringType = document.getElementById('flooring-type').value;
    
    const paintNeeded = document.getElementById('paint-needed').checked;
    const roofNeeded = document.getElementById('roof-needed').checked;
    const hvacNeeded = document.getElementById('hvac-needed').checked;
    
    const electricalScope = document.getElementById('electrical-scope').value;
    const plumbingScope = document.getElementById('plumbing-scope').value;
    const demolitionScope = document.getElementById('demolition-scope').value;
    
    const exteriorWork = [];
    document.querySelectorAll('.exterior-work:checked').forEach(checkbox => {
      exteriorWork.push(checkbox.value);
    });

    const property = {
      sqft,
      kitchenLevel: kitchenLevel === 'none' ? null : kitchenLevel,
      bathrooms: bathroomLevel === 'none' ? 0 : bathrooms,
      bathroomLevel: bathroomLevel === 'none' ? null : bathroomLevel,
      flooringType: flooringType === 'none' ? null : flooringType,
      flooringSqft,
      roofNeeded,
      hvacNeeded,
      electricalScope: electricalScope === 'none' ? null : electricalScope,
      plumbingScope: plumbingScope === 'none' ? null : plumbingScope,
      exteriorWork,
      demolitionScope: demolitionScope === 'none' ? null : demolitionScope,
      paintNeeded
    };

    this.currentEstimate = this.calculator.calculateFullRenovation(property);
    const arvAnalysis = this.calculator.generateARVEstimate(purchasePrice, this.currentEstimate.total);
    const seventyRule = this.calculator.get70PercentRule(arvAnalysis.minimumARV, this.currentEstimate.total);

    this.displayResults(this.currentEstimate, arvAnalysis, seventyRule);
  }

  displayResults(estimate, arvAnalysis, seventyRule) {
    const resultsSection = document.getElementById('renovation-results');
    const breakdownDiv = document.getElementById('cost-breakdown');
    const investmentDiv = document.getElementById('investment-summary');
    const seventyDiv = document.getElementById('seventy-rule');

    let breakdownHTML = '<div class="breakdown-items">';
    for (const [category, details] of Object.entries(estimate.estimates)) {
      if (details.total > 0) {
        breakdownHTML += `
          <div class="breakdown-item">
            <span class="category">${this.formatCategory(category)}</span>
            <span class="amount">$${details.total.toLocaleString()}</span>
          </div>
        `;
      }
    }
    
    breakdownHTML += `
      <div class="breakdown-item subtotal">
        <span class="category">Subtotal</span>
        <span class="amount">$${estimate.subtotal.toLocaleString()}</span>
      </div>
      <div class="breakdown-item">
        <span class="category">Contingency (15%)</span>
        <span class="amount">$${estimate.contingency.toLocaleString()}</span>
      </div>
      <div class="breakdown-item">
        <span class="category">Permits & Fees (3%)</span>
        <span class="amount">$${estimate.permitsFees.toLocaleString()}</span>
      </div>
      <div class="breakdown-item">
        <span class="category">Contractor Markup (20%)</span>
        <span class="amount">$${estimate.contractorMarkup.toLocaleString()}</span>
      </div>
      <div class="breakdown-item total">
        <span class="category">Total Renovation Cost</span>
        <span class="amount">$${estimate.total.toLocaleString()}</span>
      </div>
      <div class="breakdown-item">
        <span class="category">Cost per Sqft</span>
        <span class="amount">$${estimate.pricePerSqft}</span>
      </div>
    </div>`;
    
    breakdownDiv.innerHTML = breakdownHTML;

    investmentDiv.innerHTML = `
      <div class="investment-items">
        <div class="invest-item">
          <span>Purchase Price:</span>
          <span>$${arvAnalysis.purchasePrice.toLocaleString()}</span>
        </div>
        <div class="invest-item">
          <span>Renovation Cost:</span>
          <span>$${arvAnalysis.renovationCost.toLocaleString()}</span>
        </div>
        <div class="invest-item">
          <span>Holding Costs:</span>
          <span>$${arvAnalysis.holdingCosts.toLocaleString()}</span>
        </div>
        <div class="invest-item">
          <span>Selling Costs (8%):</span>
          <span>$${arvAnalysis.sellingCosts.toLocaleString()}</span>
        </div>
        <div class="invest-item total">
          <span>Total Investment:</span>
          <span>$${arvAnalysis.totalInvestment.toLocaleString()}</span>
        </div>
        <div class="invest-item highlight">
          <span>Minimum ARV (20% profit):</span>
          <span>$${arvAnalysis.minimumARV.toLocaleString()}</span>
        </div>
        <div class="invest-item">
          <span>Expected Profit:</span>
          <span>$${arvAnalysis.expectedProfit.toLocaleString()}</span>
        </div>
        <div class="invest-item">
          <span>ROI:</span>
          <span>${arvAnalysis.roi}%</span>
        </div>
      </div>
    `;

    const dealClass = seventyRule.isGoodDeal ? 'good-deal' : 'bad-deal';
    seventyDiv.innerHTML = `
      <div class="seventy-items ${dealClass}">
        <div class="seventy-item">
          <span>ARV:</span>
          <span>$${seventyRule.arv.toLocaleString()}</span>
        </div>
        <div class="seventy-item">
          <span>70% of ARV:</span>
          <span>$${seventyRule.seventyPercent.toLocaleString()}</span>
        </div>
        <div class="seventy-item">
          <span>Minus Renovation:</span>
          <span>-$${seventyRule.renovationCost.toLocaleString()}</span>
        </div>
        <div class="seventy-item total">
          <span>Max Offer Price:</span>
          <span>$${seventyRule.maxOffer.toLocaleString()}</span>
        </div>
        <div class="seventy-item">
          <span>Deal Status:</span>
          <span>${seventyRule.isGoodDeal ? '✅ GOOD DEAL' : '❌ OVERPRICED'}</span>
        </div>
      </div>
    `;

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  formatCategory(category) {
    const labels = {
      kitchen: 'Kitchen',
      bathrooms: 'Bathrooms',
      flooring: 'Flooring',
      paint: 'Paint',
      roof: 'Roof',
      hvac: 'HVAC',
      electrical: 'Electrical',
      plumbing: 'Plumbing',
      exterior: 'Exterior',
      demolition: 'Demolition'
    };
    return labels[category] || category;
  }

  exportRenovation() {
    if (!this.currentEstimate) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      property: {
        sqft: document.getElementById('reno-sqft').value,
        purchasePrice: document.getElementById('purchase-price').value
      },
      renovation: this.currentEstimate,
      source: 'COMPS.RED Renovation Calculator'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renovation-estimate-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}