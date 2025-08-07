/**
 * COMPS.RED Content Script - CLEAN VERSION
 * Simple, focused, and actually works
 */

console.log('[COMPS.RED] Content script loaded on:', window.location.href);

// Extract property data from Zillow page
function extractPropertyData() {
  console.log('[COMPS.RED] Extracting property data...');
  
  // Check if we're on a property details page
  const isPropertyPage = window.location.pathname.includes('/homedetails/');
  
  if (!isPropertyPage) {
    console.log('[COMPS.RED] Not on a property page');
    return null;
  }
  
  try {
    // Get data from Zillow's __INITIAL_STATE__ or Next.js data
    const scripts = document.querySelectorAll('script');
    let propertyData = null;
    
    // Look for Next.js data
    for (const script of scripts) {
      if (script.id === '__NEXT_DATA__' && script.type === 'application/json') {
        const nextData = JSON.parse(script.textContent);
        const pageProps = nextData?.props?.pageProps;
        
        if (pageProps?.gdpClientCache) {
          // Extract from GDP cache
          const cache = JSON.parse(pageProps.gdpClientCache);
          const propertyInfo = Object.values(cache).find(item => 
            item?.property || item?.home
          );
          
          if (propertyInfo?.property) {
            propertyData = propertyInfo.property;
          }
        }
        break;
      }
    }
    
    if (!propertyData) {
      console.log('[COMPS.RED] No property data found in page');
      return null;
    }
    
    // Extract and format the data we need
    const extracted = {
      zpid: propertyData.zpid,
      address: propertyData.streetAddress || propertyData.address?.streetAddress,
      city: propertyData.city || propertyData.address?.city,
      state: propertyData.state || propertyData.address?.state,
      zipcode: propertyData.zipcode || propertyData.address?.zipcode,
      
      price: propertyData.price || propertyData.unformattedPrice || 0,
      beds: propertyData.bedrooms || 0,
      baths: propertyData.bathrooms || 0,
      sqft: propertyData.livingArea || 0,
      lotSize: propertyData.lotSize || 0,
      yearBuilt: propertyData.yearBuilt || 0,
      
      propertyType: propertyData.homeType || 'Unknown',
      listingStatus: propertyData.homeStatus || 'Unknown',
      daysOnMarket: propertyData.daysOnZillow || 0,
      
      images: propertyData.photos?.map(p => p.url) || [],
      
      // Additional data
      zestimate: propertyData.zestimate || 0,
      rentZestimate: propertyData.rentZestimate || 0,
      monthlyHoaFee: propertyData.monthlyHoaFee || 0,
      propertyTaxRate: propertyData.propertyTaxRate || 0,
      
      // Schools
      schools: {
        elementary: propertyData.elementarySchool,
        middle: propertyData.middleSchool,
        high: propertyData.highSchool
      },
      
      // Renovation-specific data
      basement: propertyData.basement,
      hasGarage: propertyData.hasGarage || propertyData.parkingFeatures?.includes('Garage'),
      cooling: propertyData.cooling,
      heating: propertyData.heating,
      appliances: propertyData.appliances,
      flooring: propertyData.flooring,
      exteriorFeatures: propertyData.exteriorFeatures,
      roofType: propertyData.roofType,
      foundation: propertyData.foundation,
      architecturalStyle: propertyData.architecturalStyle,
      condition: propertyData.condition,
      listingSubType: propertyData.listingSubType
    };
    
    console.log('[COMPS.RED] Extracted property:', extracted.address);
    return extracted;
    
  } catch (error) {
    console.error('[COMPS.RED] Error extracting property data:', error);
    return null;
  }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[COMPS.RED] Received message:', request.type);
  
  if (request.type === 'DRAW_CARDS') {
    const propertyData = extractPropertyData();
    
    if (propertyData) {
      sendResponse({ 
        success: true, 
        properties: [propertyData] 
      });
    } else {
      sendResponse({ 
        success: false, 
        error: 'No property data found on this page' 
      });
    }
    
    return true; // Keep channel open for async response
  }
  
  if (request.type === 'PING') {
    sendResponse({ success: true, message: 'Content script is ready' });
    return false;
  }
});

console.log('[COMPS.RED] Content script ready');