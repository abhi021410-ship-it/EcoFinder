// background.js — minimal for step 1
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.action === "openPopup") {
    chrome.action.openPopup();
  }
});
