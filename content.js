console.log("Content script loaded");

// Notify background script that content script is ready
chrome.runtime.sendMessage({ action: "contentScriptReady" }, response => {
  if (chrome.runtime.lastError) {
    console.error("Error sending ready message:", chrome.runtime.lastError);
  } else {
    console.log("Background script acknowledged content script is ready");
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  
  if (message.action === "showSummary") {
    showSummaryPopup(message.summary);
    sendResponse({ success: true });
  } else if (message.action === "showError") {
    showErrorPopup(message.error);
    sendResponse({ success: true });
  }
  
  return true; // Keep the message channel open for async response
});

// Function to create and show the summary popup
function showSummaryPopup(summary) {
  // Remove any existing popup
  removeExistingPopup();
  
  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'gemini-summary-popup';
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    max-height: 400px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    padding: 15px;
    overflow-y: auto;
    font-family: Arial, sans-serif;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  `;
  
  const title = document.createElement('h3');
  title.textContent = 'Simple Summary';
  title.style.margin = '0';
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #555;
  `;
  closeBtn.onclick = removeExistingPopup;
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Create content
  const content = document.createElement('div');
  content.textContent = summary;
  content.style.lineHeight = '1.5';
  
  // Assemble popup
  popup.appendChild(header);
  popup.appendChild(content);
  
  // Add to page
  document.body.appendChild(popup);
  
  // Auto-remove after 30 seconds
  setTimeout(removeExistingPopup, 30000);
}

// Function to show error popup
function showErrorPopup(errorMessage) {
  // Remove any existing popup
  removeExistingPopup();
  
  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'gemini-summary-popup';
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    background-color: #fff0f0;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    padding: 15px;
    font-family: Arial, sans-serif;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #ffcccc;
    padding-bottom: 10px;
  `;
  
  const title = document.createElement('h3');
  title.textContent = 'Error';
  title.style.margin = '0';
  title.style.color = '#cc0000';
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #cc0000;
  `;
  closeBtn.onclick = removeExistingPopup;
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Create content
  const content = document.createElement('div');
  content.textContent = errorMessage;
  content.style.lineHeight = '1.5';
  
  // Assemble popup
  popup.appendChild(header);
  popup.appendChild(content);
  
  // Add to page
  document.body.appendChild(popup);
  
  // Auto-remove after 10 seconds
  setTimeout(removeExistingPopup, 10000);
}

// Function to remove existing popup
function removeExistingPopup() {
  const existingPopup = document.getElementById('gemini-summary-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
} 