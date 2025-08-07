# COMPS.RED Developer Guide

## Architecture Overview

COMPS.RED is a Chrome Extension (Manifest V3) that revolutionizes property comparison on Zillow.

### Core Components

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Content.js    │────▶│  Background.js   │────▶│  Side Panel     │
│ (Data Extract)  │     │ (Message Router) │     │    (UI/UX)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                                                 │
         └────────────── Extracts From ────────────────────┘
                         Zillow Pages
```

### Key Technologies
- **Chrome Extension Manifest V3**
- **Side Panel API** (Chrome 114+)
- **Pure JavaScript** (No frameworks)
- **IndexedDB** for storage
- **Chrome Storage API** for settings

## File Structure Explained

### `/core/deck-framework.js`
Base class for all deck types. Provides:
- Card management (add, remove, update)
- Storage operations
- Export functionality
- Comparison methods

### `/decks/comps-deck.js`
Extends DeckFramework specifically for property comparisons:
- Enhanced property data structure
- Comparability scoring integration
- Market analysis generation
- Duplicate detection

### `/utils/` - The Revolutionary Stuff

#### `enhanced-scoring-algorithm.js`
The heart of our truth-telling system:
```javascript
weights = {
  location: 0.45,    // 45% - Location is KING
  structure: 0.25,   // 25% - Size, layout, rooms
  condition: 0.20,   // 20% - Age, updates, maintenance
  features: 0.10     // 10% - Amenities, extras
}
```

#### `twin-finder.js`
Finds IDENTICAL properties:
- Same floor plan detection
- Track home matching
- Backing feature matching (railroad, freeway)

#### `truth-export.js`
Generates honest reports:
- Executive summaries
- Red flag warnings
- Negotiation recommendations
- Market position analysis

## Data Flow

1. **User visits Zillow property**
2. **Content script extracts data** from `__NEXT_DATA__`
3. **Background script routes messages**
4. **Side panel receives data**
5. **Scoring engine analyzes**
6. **UI displays truth**

## Key Algorithms

### Comparability Scoring
```javascript
// Traditional MLS way (WRONG):
score = 100 - (distance_in_miles * 10)

// COMPS.RED way (RIGHT):
score = locationScore * 0.45 + 
        structureScore * 0.25 + 
        conditionScore * 0.20 + 
        featuresScore * 0.10
```

### Twin Detection
```javascript
// Perfect twin criteria:
- Same beds/baths
- Within 5% square footage
- Same year built (±5 years)
- Same street or subdivision
- Score >= 95
```

## Adding New Features

### 1. New Scoring Factor
Add to `enhanced-scoring-algorithm.js`:
```javascript
redFlags: {
  your_new_factor: -15,  // Negative impact
}
valueBombs: {
  your_value_add: 10,    // Positive impact
}
```

### 2. New Card Data
Update `comps-deck.js` createCard method:
```javascript
card.data = {
  // existing fields...
  yourNewField: propertyData.yourNewField
}
```

### 3. New UI Element
Add to `card-renderer.js`:
```javascript
static renderYourFeature(card) {
  // Return HTML string
}
```

## Testing

### Manual Testing
1. Load extension in Chrome developer mode
2. Navigate to Zillow property
3. Open extension side panel
4. Click "Deal Cards"
5. Check console for scoring breakdown

### Debug Mode
Open console and look for `[COMPS.RED]` prefixed logs:
```
[COMPS.RED] Extracting property data...
[COMPS.RED] Score breakdown: {...}
```

## API Integration Points

### Google Maps API
Ready to integrate:
- API Key: `AIzaSyADEqYqqR1cuUE4I-E3iJ61tZm0H5ol064`
- Use for: Street View, satellite imagery, geocoding

### Future Integrations
- Property tax records
- Permit databases
- Crime statistics
- School ratings
- Walkability scores

## Performance Considerations

- **Lazy load** images in cards
- **Debounce** rapid card additions
- **Limit** deck size to 50 properties
- **Cache** scoring results
- **Batch** export operations

## Security Notes

- All data processed **locally**
- No external API calls (yet)
- Respects Zillow's robots.txt
- No PII stored permanently
- Export data sanitized

## Common Issues

### "Cannot establish connection"
User needs to refresh Zillow page after installing

### Empty property data
Zillow changed their data structure - check `__NEXT_DATA__`

### Scoring seems off
Check console for breakdown, adjust weights if needed

## Future Enhancements

### High Priority
1. Street View integration
2. Renovation cost calculator
3. Bureaucracy tracker
4. 3D scanning support

### Revolutionary Ideas
- Blockchain property records
- Decentralized MLS replacement
- AI permit prediction
- Crowd-sourced contractor ratings

## Contributing

We need help with:
- Market-specific scoring adjustments
- Additional red flag detection
- Export format improvements
- UI/UX enhancements

Remember: We're building this for the PEOPLE, not the gatekeepers!

## Questions?

The code tells the truth. The comments explain why. The mission drives everything.

*"250 flips taught me what matters. Now the code knows too."*