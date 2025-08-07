/**
 * COMPS.RED MASTER DEBUG SCRIPT
 * Run this in different contexts to see what's happening
 */

console.log('%c🔥 COMPS.RED DEBUG RUNNING 🔥', 'color: red; font-size: 20px; font-weight: bold');
console.log('Current URL:', window.location.href);
console.log('Context:', typeof chrome !== 'undefined' ? 'Extension' : 'Web Page');

// 1. Check what context we're in
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log('✅ Chrome Extension APIs available');
  
  // Check if we're in content script
  if (window.location.hostname.includes('zillow.com')) {
    console.log('📍 Running on Zillow page');
    
    // Test extraction
    const testExtract = () => {
      const scripts = document.querySelectorAll('script');
      let found = false;
      
      for (const script of scripts) {
        if (script.id === '__NEXT_DATA__') {
          console.log('✅ Found __NEXT_DATA__ script');
          try {
            const data = JSON.parse(script.textContent);
            console.log('📊 Next.js data:', data);
            found = true;
          } catch (e) {
            console.error('❌ Failed to parse __NEXT_DATA__:', e);
          }
          break;
        }
      }
      
      if (!found) {
        console.log('❌ No __NEXT_DATA__ found');
      }
    };
    
    testExtract();
  }
  
  // If we're in sidepanel
  if (window.compsPanel) {
    console.log('🎯 Sidepanel detected');
    console.log('Panel instance:', window.compsPanel);
    console.log('Current deck:', window.compsPanel.currentDeck);
    console.log('Cards in deck:', window.compsPanel.currentDeck?.cards?.length || 0);
  }
  
} else {
  console.log('❌ No Chrome APIs - this is a regular web page');
}

// 2. Test messaging if possible
if (chrome?.tabs?.sendMessage) {
  console.log('🔧 Testing message to content script...');
  chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    if (tabs[0]) {
      try {
        const response = await chrome.tabs.sendMessage(tabs[0].id, {type: 'PING'});
        console.log('✅ Content script responded:', response);
      } catch (e) {
        console.error('❌ Content script not responding:', e.message);
      }
    }
  });
}

// 3. Quick diagnostic info
console.log('🔍 Quick Diagnostics:');
console.log('- Document ready state:', document.readyState);
console.log('- Scripts on page:', document.scripts.length);
console.log('- Current timestamp:', new Date().toISOString());

console.log('%c🏁 DEBUG COMPLETE 🏁', 'color: green; font-size: 16px; font-weight: bold');