// Property Field Mapper - Converts Zillow's data structure to our expected format
class PropertyFieldMapper {
  constructor() {
    // Field mapping from Zillow's structure to our structure
    this.fieldMap = {
      // Basic fields
      'zpid': 'zpid',
      'streetAddress': 'address',
      'city': 'city',
      'state': 'state',
      'zipcode': 'zipcode',
      
      // Price - needs special handling
      'price': (data) => ({
        display: data.price ? `$${data.price.toLocaleString()}` : data.priceText || 'N/A',
        value: data.price || null
      }),
      
      // Core details
      'bedrooms': 'beds',
      'bathrooms': 'baths',
      'livingArea': 'sqft',
      'homeType': 'propertyType',
      'homeStatus': 'status',
      'yearBuilt': 'yearBuilt',
      
      // Lot
      'lotAreaValue': (data) => {
        if (data.lotAreaValue && data.lotAreaUnit) {
          return `${data.lotAreaValue} ${data.lotAreaUnit}`;
        }
        return data.lotSize || null;
      },
      
      // Market info
      'daysOnMarket': 'daysOnZillow',
      'timeOnZillow': 'daysOnZillow', // Alternative field name
      'mlsid': 'mlsNumber',
      
      // Financial
      'monthlyHoaFee': 'hoaFees',
      'hoaFee': 'hoaFees',
      'propertyTaxRate': 'propertyTaxes',
      'taxAssessedValue': 'taxAssessedValue',
      'zestimate': 'zestimate',
      'rentZestimate': 'rentZestimate',
      'pricePerSqft': 'pricePerSqft',
      
      // Listing info
      'listingAgent': (data) => data.attributionInfo?.listingAgent || data.listingAgent,
      'brokerName': (data) => data.attributionInfo?.brokerName || data.brokerName,
      'listingOffice': (data) => data.attributionInfo?.listingOffice || data.listingOffice,
      
      // Description
      'description': 'description',
      'listingDescription': 'description',
      'resoFacts.description': 'description',
      
      // Location
      'neighborhood': 'neighborhood',
      'parcelNumber': 'parcelNumber',
      
      // Features
      'parkingCapacity': 'parking',
      'garageSpaces': 'garageSpaces',
      'numStories': 'stories',
      'hasGarage': 'hasGarage',
      'hasPrivatePool': 'hasPool',
      
      // Arrays that need joining
      'heatingFeatures': (data) => data.heatingFeatures?.join(', ') || data.heating,
      'coolingFeatures': (data) => data.coolingFeatures?.join(', ') || data.cooling,
      'appliances': (data) => data.appliances?.join(', '),
      'flooring': (data) => data.flooring?.join(', '),
      
      // Schools
      'schools': 'schools',
      'elementarySchools': (data) => data.elementarySchools || [],
      'middleSchools': (data) => data.middleSchools || [],
      'highSchools': (data) => data.highSchools || [],
      
      // Images
      'streetViewTileImageUrlMediumAddress': 'image',
      'hiResImageLink': 'image',
      'responsivePhotos': (data) => {
        if (Array.isArray(data.responsivePhotos)) {
          return data.responsivePhotos.map(p => p.url || p.mixedSources?.jpeg?.[0]?.url).filter(Boolean);
        }
        return [];
      },
      
      // Dates
      'datePosted': 'listedDate',
      'dateSold': 'lastSoldDate',
      'lastSoldPrice': 'lastSoldPrice',
      
      // Additional info
      'county': 'county',
      'countyFIPS': 'countyFIPS',
      'parcelId': 'parcelId',
      'solarPotential': 'solarPotential',
      'walkScore': 'walkScore',
      'transitScore': 'transitScore'
    };
  }

  /**
   * Map Zillow property data to our expected format
   * @param {Object} zillowData - Raw property data from Zillow
   * @returns {Object} Mapped property data
   */
  mapProperty(zillowData) {
    if (!zillowData) return null;
    
    const mapped = {
      scrapedAt: new Date().toISOString()
    };
    
    // Process each field
    Object.entries(this.fieldMap).forEach(([zillowField, ourField]) => {
      // Get the value from zillow data (supports nested paths)
      const value = this.getNestedValue(zillowData, zillowField);
      
      if (value !== undefined && value !== null) {
        if (typeof ourField === 'function') {
          // Custom mapping function
          const result = ourField(zillowData);
          if (result !== undefined && result !== null) {
            // Find the target field name from the function
            const targetField = this.findTargetField(zillowField);
            if (targetField) {
              mapped[targetField] = result;
            }
          }
        } else if (typeof ourField === 'string') {
          // Direct mapping
          mapped[ourField] = value;
        }
      }
    });
    
    // Handle special cases
    
    // Price field special handling
    if (typeof mapped.price === 'function') {
      mapped.price = this.fieldMap.price(zillowData);
    }
    
    // Calculate price per sqft if not provided
    if (!mapped.pricePerSqft && mapped.price?.value && mapped.sqft) {
      mapped.pricePerSqft = Math.round(mapped.price.value / mapped.sqft);
    }
    
    // Ensure we have display address
    if (!mapped.address && zillowData.streetAddress) {
      mapped.address = [
        zillowData.streetAddress,
        zillowData.city,
        zillowData.state,
        zillowData.zipcode
      ].filter(Boolean).join(', ');
    }
    
    // Extract school ratings
    if (!mapped.schoolRatings) {
      mapped.schoolRatings = this.extractSchoolRatings(zillowData);
    }
    
    // Handle status
    if (!mapped.status && zillowData.homeStatus) {
      mapped.status = this.normalizeStatus(zillowData.homeStatus);
    }
    
    return mapped;
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Find target field name for function mappings
   */
  findTargetField(zillowField) {
    const commonMappings = {
      'price': 'price',
      'lotAreaValue': 'lotSize',
      'listingAgent': 'agentName',
      'brokerName': 'brokerName',
      'heatingFeatures': 'heating',
      'coolingFeatures': 'cooling',
      'appliances': 'appliances',
      'responsivePhotos': 'images'
    };
    
    return commonMappings[zillowField] || zillowField;
  }

  /**
   * Extract school ratings from various possible locations
   */
  extractSchoolRatings(data) {
    const schools = [];
    
    // Try different school data locations
    const schoolSources = [
      data.schools,
      data.elementarySchools,
      data.middleSchools,
      data.highSchools,
      data.nearbySchools
    ];
    
    schoolSources.forEach(source => {
      if (Array.isArray(source)) {
        source.forEach(school => {
          if (school && school.name) {
            schools.push({
              name: school.name,
              rating: school.rating || school.greatSchoolsRating,
              level: school.level || school.type || school.grades,
              distance: school.distance
            });
          }
        });
      }
    });
    
    return schools;
  }

  /**
   * Normalize property status
   */
  normalizeStatus(status) {
    const statusMap = {
      'FOR_SALE': 'For Sale',
      'FOR_RENT': 'For Rent',
      'SOLD': 'Sold',
      'OFF_MARKET': 'Off Market',
      'PENDING': 'Pending',
      'CONTINGENT': 'Contingent',
      'COMING_SOON': 'Coming Soon'
    };
    
    return statusMap[status] || status;
  }

  /**
   * Batch map multiple properties
   */
  mapProperties(properties) {
    if (!Array.isArray(properties)) return [];
    return properties.map(prop => this.mapProperty(prop)).filter(Boolean);
  }
}

// Create singleton instance
const propertyFieldMapper = new PropertyFieldMapper();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PropertyFieldMapper, propertyFieldMapper };
} else if (typeof window !== 'undefined') {
  window.PropertyFieldMapper = PropertyFieldMapper;
  window.propertyFieldMapper = propertyFieldMapper;
}