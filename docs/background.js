/**
 * COMPS.RED Background Script - CLEAN VERSION
 * Simple message router only
 */

console.log('[COMPS.RED] Background service worker started');

// Handle extension icon click - open side panel
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});

// That's it! No complex message routing needed
// The sidepanel talks directly to content script