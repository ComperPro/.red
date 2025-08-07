class RenovationCalculator {
  constructor() {
    this.laborRates = {
      skilled: 65,
      general: 35,
      specialist: 85
    };
    
    this.markupFactors = {
      contractor: 1.20,
      materials: 1.15,
      unexpected: 1.10
    };
  }

  calculateKitchen(sqft, level = 'standard') {
    // Real costs from 250+ flips - kitchen is typically 10% of home sqft
    const kitchenSqft = sqft * 0.1;
    const costs = {
      budget: { 
        cabinets: 3000,     // Home Depot stock cabinets
        counters: 1500,     // Laminate countertops
        appliances: 2500,   // Basic appliance package
        labor: 3000         // Installation
      },
      standard: { 
        cabinets: 8000,     // Semi-custom cabinets
        counters: 3500,     // Quartz countertops
        appliances: 5000,   // Stainless steel package
        labor: 5000         // Professional installation
      },
      premium: { 
        cabinets: 20000,    // Custom cabinets
        counters: 8000,     // High-end quartz/granite
        appliances: 15000,  // Professional grade
        labor: 10000        // Expert installation
      }
    };
    
    const selected = costs[level];
    const materials = selected.cabinets + selected.counters + selected.appliances;
    const labor = selected.labor;
    
    return {
      materials: Math.round(materials),
      labor: Math.round(labor),
      total: Math.round(materials + labor),
      breakdown: {
        cabinets: selected.cabinets,
        countertops: selected.counters,
        appliances: selected.appliances,
        installation: labor
      }
    };
  }

  calculateBathroom(count, level = 'standard') {
    const costs = {
      budget: { full: 3500, half: 2000 },    // Basic fixtures, tile surround
      standard: { full: 7000, half: 3500 },  // Good fixtures, full tile
      premium: { full: 15000, half: 7500 }   // High-end everything
    };
    
    const fullBaths = Math.floor(count);
    const halfBaths = count % 1 > 0 ? 1 : 0;
    
    const total = (fullBaths * costs[level].full) + (halfBaths * costs[level].half);
    
    return {
      total: Math.round(total),
      perBath: costs[level].full,
      fullBaths,
      halfBaths
    };
  }

  calculateFlooring(sqft, type = 'lvp') {
    const costs = {
      carpet: { material: 2, install: 1.5 },      // $3.50/sqft total
      lvp: { material: 3, install: 2 },           // $5/sqft total  
      hardwood: { material: 5, install: 3 },      // $8/sqft total
      tile: { material: 4, install: 4 },          // $8/sqft total
      laminate: { material: 2.5, install: 2 }     // $4.50/sqft total
    };
    
    const perSqft = costs[type];
    const materials = perSqft.material * sqft;
    const labor = perSqft.install * sqft;
    
    return {
      materials: Math.round(materials),
      labor: Math.round(labor),
      total: Math.round(materials + labor),
      pricePerSqft: perSqft.material + perSqft.install
    };
  }

  calculatePaint(sqft, ceilingHeight = 9) {
    const wallSqft = sqft * 2.5;
    const ceilingSqft = sqft;
    const totalPaintSqft = wallSqft + ceilingSqft;
    
    const gallonsNeeded = Math.ceil(totalPaintSqft / 350);
    const paintCost = gallonsNeeded * 40;
    const laborHours = totalPaintSqft / 200;
    const laborCost = laborHours * this.laborRates.general;
    
    return {
      materials: Math.round(paintCost),
      labor: Math.round(laborCost),
      total: Math.round(paintCost + laborCost),
      gallons: gallonsNeeded,
      sqftCoverage: totalPaintSqft
    };
  }

  calculateRoof(sqft, type = 'shingle') {
    const roofSqft = sqft * 1.3;
    const squares = roofSqft / 100;
    
    const costs = {
      shingle: { material: 100, labor: 100 },   // $200/square total
      metal: { material: 250, labor: 150 },     // $400/square total
      tile: { material: 350, labor: 200 },      // $550/square total
      flat: { material: 150, labor: 150 }       // $300/square total
    };
    
    const perSquare = costs[type];
    const materials = perSquare.material * squares;
    const labor = perSquare.labor * squares;
    
    return {
      materials: Math.round(materials),
      labor: Math.round(labor),
      total: Math.round(materials + labor),
      squares: Math.round(squares * 10) / 10
    };
  }

  calculateHVAC(sqft, system = 'central') {
    const tons = Math.ceil(sqft / 500);
    
    const costs = {
      central: { unit: 2500, install: 1500 },    // $4000 for 3-ton
      heatPump: { unit: 3500, install: 2000 },   // $5500 for 3-ton
      minisplit: { unit: 1500, install: 1000 },  // $2500 per unit
      window: { unit: 400, install: 100 }        // $500 per unit
    };
    
    const systemCost = costs[system];
    const totalUnit = systemCost.unit * (system === 'window' ? Math.ceil(sqft / 400) : 1);
    const totalInstall = systemCost.install * (system === 'minisplit' ? Math.ceil(tons / 2) : 1);
    
    return {
      equipment: Math.round(totalUnit),
      installation: Math.round(totalInstall),
      total: Math.round(totalUnit + totalInstall),
      tonnage: tons
    };
  }

  calculateElectrical(sqft, scope = 'update') {
    const costs = {
      update: 3,     // $3/sqft for basic updates
      partial: 6,    // $6/sqft for partial rewire
      rewire: 10     // $10/sqft for full rewire
    };
    
    const baseCost = costs[scope] * sqft;
    const panelUpgrade = scope === 'rewire' ? 2000 : 0;
    
    return {
      wiring: Math.round(baseCost),
      panel: panelUpgrade,
      total: Math.round(baseCost + panelUpgrade),
      pricePerSqft: costs[scope]
    };
  }

  calculatePlumbing(fixtures, scope = 'update') {
    const costs = {
      update: 500,
      replace: 1000,
      repipe: 2000
    };
    
    const perFixture = costs[scope];
    const total = perFixture * fixtures;
    
    return {
      perFixture,
      fixtures,
      total: Math.round(total)
    };
  }

  calculateExterior(sqft, work = []) {
    let total = 0;
    const breakdown = {};
    
    if (work.includes('siding')) {
      const sidingSqft = sqft * 1.5;
      breakdown.siding = Math.round(sidingSqft * 8);
      total += breakdown.siding;
    }
    
    if (work.includes('windows')) {
      const windowCount = Math.ceil(sqft / 120);
      breakdown.windows = windowCount * 600;
      total += breakdown.windows;
    }
    
    if (work.includes('doors')) {
      breakdown.doors = 2500;
      total += breakdown.doors;
    }
    
    if (work.includes('deck')) {
      breakdown.deck = 5000;
      total += breakdown.deck;
    }
    
    if (work.includes('driveway')) {
      breakdown.driveway = 4000;
      total += breakdown.driveway;
    }
    
    if (work.includes('landscaping')) {
      breakdown.landscaping = 3000;
      total += breakdown.landscaping;
    }
    
    return {
      total: Math.round(total),
      breakdown
    };
  }

  calculateDemolition(sqft, scope = 'surface') {
    const costs = {
      surface: 1,      // $1/sqft light demo
      selective: 3,    // $3/sqft selective demo
      gutToStuds: 5    // $5/sqft full gut
    };
    
    const laborCost = costs[scope] * sqft;
    const dumpsterCost = Math.ceil(sqft / 1000) * 400;  // $400 per 10-yard dumpster
    
    return {
      labor: Math.round(laborCost),
      disposal: dumpsterCost,
      total: Math.round(laborCost + dumpsterCost),
      dumpsters: Math.ceil(sqft / 500)
    };
  }

  calculateFullRenovation(property) {
    const {
      sqft = 1500,
      kitchenLevel = 'standard',
      bathrooms = 2,
      bathroomLevel = 'standard',
      flooringType = 'lvp',
      flooringSqft = null,
      roofNeeded = false,
      hvacNeeded = false,
      electricalScope = 'update',
      plumbingScope = 'update',
      exteriorWork = [],
      demolitionScope = 'surface',
      paintNeeded = true
    } = property;

    const actualFlooringSqft = flooringSqft || sqft * 0.8;
    
    const estimates = {
      kitchen: this.calculateKitchen(sqft * 0.1, kitchenLevel),
      bathrooms: this.calculateBathroom(bathrooms, bathroomLevel),
      flooring: this.calculateFlooring(actualFlooringSqft, flooringType),
      paint: paintNeeded ? this.calculatePaint(sqft) : { total: 0 },
      roof: roofNeeded ? this.calculateRoof(sqft) : { total: 0 },
      hvac: hvacNeeded ? this.calculateHVAC(sqft) : { total: 0 },
      electrical: this.calculateElectrical(sqft, electricalScope),
      plumbing: this.calculatePlumbing(bathrooms * 3, plumbingScope),
      exterior: this.calculateExterior(sqft, exteriorWork),
      demolition: this.calculateDemolition(sqft, demolitionScope)
    };

    const subtotal = Object.values(estimates).reduce((sum, item) => sum + item.total, 0);
    
    const contingency = subtotal * 0.15;
    const permitsFees = subtotal * 0.03;
    const contractorMarkup = subtotal * 0.20;
    
    const total = subtotal + contingency + permitsFees + contractorMarkup;

    return {
      estimates,
      subtotal: Math.round(subtotal),
      contingency: Math.round(contingency),
      permitsFees: Math.round(permitsFees),
      contractorMarkup: Math.round(contractorMarkup),
      total: Math.round(total),
      pricePerSqft: Math.round(total / sqft)
    };
  }

  generateARVEstimate(purchasePrice, renovationCost, profitMargin = 0.20) {
    const totalInvestment = purchasePrice + renovationCost;
    const holdingCosts = totalInvestment * 0.05;
    const sellingCosts = totalInvestment * 1.3 * 0.08;
    
    const minARV = (totalInvestment + holdingCosts + sellingCosts) / (1 - profitMargin);
    
    return {
      purchasePrice,
      renovationCost,
      holdingCosts: Math.round(holdingCosts),
      sellingCosts: Math.round(sellingCosts),
      totalInvestment: Math.round(totalInvestment + holdingCosts),
      minimumARV: Math.round(minARV),
      expectedProfit: Math.round(minARV * profitMargin),
      roi: Math.round((profitMargin / (1 - profitMargin)) * 100)
    };
  }

  get70PercentRule(arv, renovationCost) {
    const maxOffer = (arv * 0.70) - renovationCost;
    
    return {
      arv,
      seventyPercent: Math.round(arv * 0.70),
      renovationCost,
      maxOffer: Math.round(maxOffer),
      isGoodDeal: maxOffer > 0
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RenovationCalculator;
}