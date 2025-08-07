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
    const costs = {
      budget: { cabinets: 100, counters: 40, appliances: 150, labor: 80 },
      standard: { cabinets: 200, counters: 75, appliances: 250, labor: 120 },
      premium: { cabinets: 400, counters: 150, appliances: 500, labor: 200 }
    };
    
    const perSqft = costs[level];
    const materials = (perSqft.cabinets + perSqft.counters + perSqft.appliances) * sqft;
    const labor = perSqft.labor * sqft;
    
    return {
      materials: Math.round(materials),
      labor: Math.round(labor),
      total: Math.round(materials + labor),
      breakdown: {
        cabinets: Math.round(perSqft.cabinets * sqft),
        countertops: Math.round(perSqft.counters * sqft),
        appliances: Math.round(perSqft.appliances * sqft),
        installation: Math.round(labor)
      }
    };
  }

  calculateBathroom(count, level = 'standard') {
    const costs = {
      budget: { full: 5000, half: 2500 },
      standard: { full: 10000, half: 5000 },
      premium: { full: 20000, half: 10000 }
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
      carpet: { material: 3, install: 2 },
      lvp: { material: 4, install: 3 },
      hardwood: { material: 8, install: 5 },
      tile: { material: 6, install: 7 },
      laminate: { material: 3.5, install: 2.5 }
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
      shingle: { material: 150, labor: 150 },
      metal: { material: 300, labor: 200 },
      tile: { material: 400, labor: 250 },
      flat: { material: 200, labor: 180 }
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
      central: { unit: 3500, install: 2500 },
      heatPump: { unit: 4500, install: 3000 },
      minisplit: { unit: 2000, install: 1500 },
      window: { unit: 500, install: 200 }
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
      update: 15,
      partial: 25,
      rewire: 40
    };
    
    const baseCost = costs[scope] * sqft;
    const panelUpgrade = scope === 'rewire' ? 3000 : 0;
    
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
      surface: 2,
      selective: 5,
      gutToStuds: 10
    };
    
    const laborCost = costs[scope] * sqft;
    const dumpsterCost = Math.ceil(sqft / 500) * 500;
    
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