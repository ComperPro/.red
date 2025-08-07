/**
 * KNOCKOUT MODE - For Michelle Who Boxes
 * When you need to knock out the competition
 */

class KnockoutMode {
  constructor() {
    this.combos = {
      jab: this.quickAnalysis,
      cross: this.deepDive,
      hook: this.findWeakness,
      uppercut: this.killShot
    };
    
    this.powerLevel = 0;
    this.knockouts = 0;
  }

  activate() {
    console.log('🥊 KNOCKOUT MODE ACTIVATED - Let\'s throw hands at these overpriced listings!');
    document.body.classList.add('knockout-mode');
    this.showFighterStats();
  }

  quickAnalysis(property) {
    // JAB - Quick price check
    const overpriced = property.price > property.zestimate * 1.1;
    const timeOnMarket = property.daysOnMarket;
    
    if (overpriced && timeOnMarket > 30) {
      return {
        verdict: '🥊 JAB LANDED',
        message: 'Overpriced and stale - seller is on the ropes',
        damage: 25
      };
    }
    
    return {
      verdict: 'Blocked',
      message: 'Fair price, keep your guard up',
      damage: 0
    };
  }

  deepDive(property, comparables) {
    // CROSS - Power analysis
    const avgPrice = comparables.reduce((sum, comp) => 
      sum + comp.price, 0) / comparables.length;
    
    const overpricePercent = ((property.price - avgPrice) / avgPrice) * 100;
    
    if (overpricePercent > 20) {
      return {
        verdict: '🥊 CROSS CONNECTS',
        message: `${overpricePercent.toFixed(0)}% overpriced - that's a body blow`,
        damage: 50
      };
    }
    
    return {
      verdict: 'Glancing blow',
      message: 'Within market range',
      damage: 10
    };
  }

  findWeakness(property) {
    // HOOK - Find the weak spots
    const weaknesses = [];
    
    if (property.yearBuilt < 1980) {
      weaknesses.push('Old bones - major systems likely shot');
    }
    
    if (property.daysOnMarket > 60) {
      weaknesses.push('Stale listing - seller desperate');
    }
    
    if (property.priceDrops > 0) {
      weaknesses.push('Already dropped price - keep pressing');
    }
    
    if (!property.garage) {
      weaknesses.push('No garage - limits buyer pool');
    }
    
    return {
      verdict: weaknesses.length > 2 ? '🥊 HOOK TO THE BODY' : 'Searching for opening',
      weaknesses,
      damage: weaknesses.length * 15
    };
  }

  killShot(property, analysis) {
    // UPPERCUT - The knockout blow
    const realValue = analysis.suggestedValue;
    const askingPrice = property.price;
    const overprice = askingPrice - realValue;
    
    if (overprice > 50000) {
      this.knockouts++;
      return {
        verdict: '🥊💥 KNOCKOUT!',
        message: `Overpriced by $${(overprice/1000).toFixed(0)}K - DOWN GOES THE LISTING!`,
        offer: realValue * 0.85,
        damage: 100,
        celebration: this.celebrate()
      };
    }
    
    return {
      verdict: 'Still standing',
      message: 'Keep working the body',
      damage: 30
    };
  }

  calculateCombo(property, comparables, analysis) {
    let totalDamage = 0;
    const moves = [];
    
    // Throw the combo
    const jab = this.quickAnalysis(property);
    moves.push(jab);
    totalDamage += jab.damage;
    
    const cross = this.deepDive(property, comparables);
    moves.push(cross);
    totalDamage += cross.damage;
    
    const hook = this.findWeakness(property);
    moves.push(hook);
    totalDamage += hook.damage;
    
    if (totalDamage > 75) {
      const uppercut = this.killShot(property, analysis);
      moves.push(uppercut);
      totalDamage += uppercut.damage;
    }
    
    return {
      moves,
      totalDamage,
      knockout: totalDamage >= 100,
      fighterStatus: this.getFighterStatus(totalDamage)
    };
  }

  getFighterStatus(damage) {
    if (damage >= 100) {
      return '🏆 CHAMPION - You knocked them out!';
    } else if (damage >= 75) {
      return '🥊 DOMINATING - They\'re wobbling!';
    } else if (damage >= 50) {
      return '💪 WINNING - Keep the pressure on!';
    } else if (damage >= 25) {
      return '👊 COMPETITIVE - Find your opening!';
    } else {
      return '🛡️ FEELING OUT - Study your opponent!';
    }
  }

  showFighterStats() {
    const stats = document.createElement('div');
    stats.className = 'fighter-stats';
    stats.innerHTML = `
      <div class="fighter-card">
        <h3>🥊 FIGHTER: MICHELLE</h3>
        <div class="stats">
          <div>Knockouts: <span id="knockout-count">${this.knockouts}</span></div>
          <div>Power Level: <span id="power-level">${this.powerLevel}%</span></div>
          <div>Win Streak: <span id="win-streak">0</span></div>
        </div>
        <div class="special-moves">
          <button class="combo-btn" data-combo="jab-cross">Jab-Cross Combo</button>
          <button class="combo-btn" data-combo="body-shot">Body Shot Special</button>
          <button class="combo-btn" data-combo="haymaker">Haymaker Finisher</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(stats);
    this.attachComboListeners();
  }

  attachComboListeners() {
    document.querySelectorAll('.combo-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const combo = e.target.dataset.combo;
        this.executeSpecialMove(combo);
      });
    });
  }

  executeSpecialMove(combo) {
    console.log(`🥊 Executing ${combo.toUpperCase()}!`);
    
    const effects = {
      'jab-cross': () => {
        this.powerLevel += 20;
        this.animatePunch('jab-cross');
      },
      'body-shot': () => {
        this.powerLevel += 30;
        this.animatePunch('body-shot');
      },
      'haymaker': () => {
        if (this.powerLevel >= 80) {
          this.powerLevel = 100;
          this.animatePunch('haymaker');
          this.triggerKnockout();
        }
      }
    };
    
    if (effects[combo]) {
      effects[combo]();
      this.updatePowerMeter();
    }
  }

  animatePunch(type) {
    const punch = document.createElement('div');
    punch.className = `punch-animation ${type}`;
    punch.innerHTML = '🥊';
    document.body.appendChild(punch);
    
    setTimeout(() => punch.remove(), 1000);
  }

  triggerKnockout() {
    const ko = document.createElement('div');
    ko.className = 'knockout-animation';
    ko.innerHTML = `
      <div class="ko-text">
        <h1>K.O.!</h1>
        <p>You've knocked out another overpriced listing!</p>
        <p>Knockouts: ${++this.knockouts}</p>
      </div>
    `;
    
    document.body.appendChild(ko);
    
    setTimeout(() => ko.remove(), 3000);
    
    // Victory sound
    this.playSound('victory');
  }

  updatePowerMeter() {
    const powerEl = document.getElementById('power-level');
    if (powerEl) {
      powerEl.textContent = `${this.powerLevel}%`;
      powerEl.style.color = this.powerLevel > 80 ? '#ff0000' : 
                           this.powerLevel > 50 ? '#ff9900' : '#ffcc00';
    }
  }

  celebrate() {
    const celebrations = [
      '🏆 AND THE CROWD GOES WILD!',
      '💪 UNDISPUTED CHAMPION!',
      '🎯 PERFECT TECHNIQUE!',
      '⚡ LIGHTNING STRIKES!',
      '🔥 ON FIRE TONIGHT!'
    ];
    
    return celebrations[Math.floor(Math.random() * celebrations.length)];
  }

  playSound(type) {
    // Would play sound effects if we had them
    console.log(`🔊 Playing ${type} sound effect`);
  }

  addBoxingStyles() {
    const styles = `
      .knockout-mode {
        position: relative;
      }
      
      .fighter-stats {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: slide-in 0.5s ease;
      }
      
      .fighter-card {
        background: linear-gradient(135deg, #ff0000, #990000);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        min-width: 250px;
      }
      
      .fighter-card h3 {
        margin: 0 0 15px 0;
        font-size: 18px;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      }
      
      .stats > div {
        padding: 5px 0;
        font-weight: bold;
      }
      
      .special-moves {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .combo-btn {
        background: rgba(255,255,255,0.2);
        border: 2px solid white;
        color: white;
        padding: 8px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s;
      }
      
      .combo-btn:hover {
        background: white;
        color: #ff0000;
        transform: scale(1.05);
      }
      
      .punch-animation {
        position: fixed;
        font-size: 100px;
        z-index: 10001;
        animation: punch 0.5s ease;
      }
      
      .punch-animation.jab-cross {
        top: 50%;
        left: 50%;
      }
      
      .punch-animation.body-shot {
        top: 60%;
        left: 45%;
      }
      
      .punch-animation.haymaker {
        top: 40%;
        left: 50%;
        font-size: 150px;
        animation: haymaker 0.7s ease;
      }
      
      @keyframes punch {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0); }
        50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); }
        100% { transform: translate(-50%, -50%) scale(0) rotate(360deg); }
      }
      
      @keyframes haymaker {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0); }
        50% { transform: translate(-50%, -50%) scale(2) rotate(360deg); }
        100% { transform: translate(-50%, -50%) scale(0) rotate(720deg); }
      }
      
      .knockout-animation {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
        animation: ko-flash 3s ease;
      }
      
      .ko-text {
        text-align: center;
        color: white;
      }
      
      .ko-text h1 {
        font-size: 120px;
        margin: 0;
        animation: ko-zoom 1s ease;
        text-shadow: 0 0 50px #ff0000;
      }
      
      @keyframes ko-zoom {
        0% { transform: scale(0) rotate(0); }
        50% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0); }
      }
      
      @keyframes ko-flash {
        0%, 100% { opacity: 0; }
        10%, 90% { opacity: 1; }
      }
      
      @keyframes slide-in {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}

// Auto-initialize if Michelle is detected
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KnockoutMode;
}