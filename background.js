// Your Gemini API key - you'll need to get this from Google AI Studio
let apiKey = '';
console.log("Background script loaded");

// Initialize context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed, creating context menu");
  chrome.contextMenus.create({
    id: "findGoogleEquivalent",
    title: "Find Google Cloud Equivalent",
    contexts: ["selection"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Context menu clicked:", info.menuItemId);
  
  if (info.menuItemId === "findGoogleEquivalent") {
    const selectedText = info.selectionText;
    console.log("Finding Google Cloud equivalent for:", selectedText);
    
    if (!apiKey) {
      alert("Please set your Gemini API key in the extension popup");
      return;
    }
    
    findGoogleEquivalent(selectedText, tab.id);
  }
});

// Store API key from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  
  if (message.action === "setApiKey") {
    apiKey = message.apiKey;
    chrome.storage.local.set({ geminiApiKey: apiKey });
    sendResponse({ success: true });
    return true; // Keep the message channel open for the async response
  }
  
  if (message.action === "contentScriptReady") {
    console.log("Content script is ready in tab:", sender.tab.id);
    sendResponse({ acknowledged: true });
    return true;
  }
  
  if (message.action === "analyzeWebpage") {
    if (!apiKey) {
      sendResponse({ error: "API key not set" });
      return true;
    }
    
    // Show "Processing request" popup immediately
    chrome.scripting.executeScript({
      target: { tabId: message.tabId },
      func: showProcessingPopup
    }).then(() => {
      // Then start the actual analysis
      analyzeCloudProvider(message.pageContent, message.url, message.tabId);
    }).catch(err => {
      console.error("Script injection error:", err);
    });
    
    sendResponse({ status: "Analysis started" });
    return true;
  }
});

// Function to show "Processing request" popup
function showProcessingPopup() {
  // Create popup element
  const popup = document.createElement('div');
  popup.id = 'gemini-cloud-popup';
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 700px;
    max-height: 80vh;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    padding: 20px;
    overflow-y: auto;
    font-family: Arial, sans-serif;
    color: black;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  `;
  
  const title = document.createElement('h2');
  title.textContent = 'Google Cloud Equivalents';
  title.style.cssText = `
    margin: 0;
    color: black;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: black;
  `;
  closeBtn.onclick = () => popup.remove();
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Create loading message
  const loadingMsg = document.createElement('div');
  loadingMsg.id = 'loading-message';
  loadingMsg.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: black;
  `;
  
  const loadingText = document.createElement('p');
  loadingText.textContent = 'Processing request...';
  loadingText.style.cssText = `
    font-size: 18px;
    margin-bottom: 20px;
    color: black;
  `;
  
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    border: 5px solid #f3f3f3;
    border-top: 5px solid #4285F4;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
  `;
  
  // Add the spinner animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  loadingMsg.appendChild(loadingText);
  loadingMsg.appendChild(spinner);
  
  // Assemble popup
  document.head.appendChild(style);
  popup.appendChild(header);
  popup.appendChild(loadingMsg);
  
  // Remove any existing popup
  const existingPopup = document.getElementById('gemini-cloud-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Add to page
  document.body.appendChild(popup);
}

// Function to find Google Cloud equivalent for a specific product
async function findGoogleEquivalent(productName, tabId) {
  try {
    // Show small processing popup
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (product) => {
        // Create small popup element
        const popup = document.createElement('div');
        popup.id = 'gemini-product-popup';
        popup.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          width: 350px;
          max-height: 300px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          z-index: 10000;
          padding: 15px;
          overflow-y: auto;
          font-family: Arial, sans-serif;
          color: black;
        `;
        
        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'Google Cloud Equivalent';
        title.style.cssText = `
          margin: 0;
          color: black;
          font-size: 16px;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: black;
        `;
        closeBtn.onclick = () => popup.remove();
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Create loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'product-loading-message';
        loadingMsg.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: black;
        `;
        
        const loadingText = document.createElement('p');
        loadingText.textContent = `Finding equivalent for "${product}"...`;
        loadingText.style.cssText = `
          font-size: 14px;
          margin-bottom: 15px;
          color: black;
        `;
        
        const spinner = document.createElement('div');
        spinner.style.cssText = `
          border: 3px solid #f3f3f3;
          border-top: 3px solid #4285F4;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          animation: spin 2s linear infinite;
        `;
        
        // Add the spinner animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        
        loadingMsg.appendChild(loadingText);
        loadingMsg.appendChild(spinner);
        
        // Assemble popup
        document.head.appendChild(style);
        popup.appendChild(header);
        popup.appendChild(loadingMsg);
        
        // Remove any existing popup
        const existingPopup = document.getElementById('gemini-product-popup');
        if (existingPopup) {
          existingPopup.remove();
        }
        
        // Add to page
        document.body.appendChild(popup);
      },
      args: [productName]
    });
    
    console.log("Calling Gemini API for product equivalent");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a cloud computing expert. I need to find the Google Cloud equivalent for this product or service: "${productName}".

Please provide a concise response with:
1. The name of the Google Cloud equivalent product/service
2. A brief one-sentence description of what it does
3. A link to its documentation

IMPORTANT: Format your response directly as HTML with inline styles. DO NOT include any markdown code block markers. Your response should start directly with the HTML content.

<div style="color: black;">
  <h3 style="color: black; margin-top: 0;">Google Cloud Equivalent: [Product Name]</h3>
  <p style="color: black; margin-bottom: 15px;">[Brief description of what it does in one sentence]</p>
  <p style="color: black;"><strong>Documentation:</strong> <a href="[doc-url]" style="color: #4285F4; text-decoration: none;">[doc-url]</a></p>
</div>

Use Google Search to ground your response with accurate and up-to-date information about Google Cloud products and services.`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    const data = await response.json();
    console.log("API response received for product equivalent");
    
    if (data.error) {
      console.error("API error:", data.error);
      updateProductPopupWithError(tabId, "Gemini API Error: " + (data.error.message || "Error calling Gemini API"));
      return;
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error("Unexpected API response format:", data);
      updateProductPopupWithError(tabId, "Unexpected API response format");
      return;
    }

    let productInfo = data.candidates[0].content.parts[0].text;
    
    // Remove any markdown code block markers if they exist
    productInfo = productInfo.replace(/```html\s*/g, '');
    productInfo = productInfo.replace(/```\s*$/g, '');
    
    console.log("Product info generated:", productInfo.substring(0, 50) + "...");
    
    // Update the popup with the results
    updateProductPopupWithResults(tabId, productInfo);
    
  } catch (error) {
    console.error("API call failed:", error);
    updateProductPopupWithError(tabId, "Failed to connect to Gemini API: " + error.message);
  }
}

// Function to update the product popup with results
function updateProductPopupWithResults(tabId, htmlContent) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (content) => {
      // Get the existing popup
      const popup = document.getElementById('gemini-product-popup');
      if (!popup) {
        console.error("Product popup not found");
        return;
      }
      
      // Remove the loading message
      const loadingMsg = document.getElementById('product-loading-message');
      if (loadingMsg) {
        loadingMsg.remove();
      }
      
      // Create content container
      const contentContainer = document.createElement('div');
      contentContainer.id = 'product-content';
      contentContainer.style.cssText = `
        padding: 5px;
        color: black;
        background-color: white;
      `;
      
      // Set the HTML content directly
      contentContainer.innerHTML = content;
      
      // Add CSS to ensure proper styling
      const style = document.createElement('style');
      style.textContent = `
        #gemini-product-popup {
          color: black !important;
          background-color: white !important;
        }
        #gemini-product-popup * {
          color: black !important;
        }
        #gemini-product-popup h3 {
          color: black !important;
          margin-top: 0;
          font-size: 16px;
        }
        #gemini-product-popup a {
          color: #4285F4 !important;
        }
      `;
      
      // Add the style and content to the popup
      document.head.appendChild(style);
      popup.appendChild(contentContainer);
    },
    args: [htmlContent]
  }).catch(err => {
    console.error("Script injection error:", err);
    updateProductPopupWithError(tabId, "Failed to display results: " + err.message);
  });
}

// Function to update the product popup with an error message
function updateProductPopupWithError(tabId, errorMessage) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (errorMsg) => {
      // Get the existing popup
      const popup = document.getElementById('gemini-product-popup');
      if (!popup) {
        console.error("Product popup not found");
        return;
      }
      
      // Remove the loading message
      const loadingMsg = document.getElementById('product-loading-message');
      if (loadingMsg) {
        loadingMsg.remove();
      }
      
      // Create error message
      const errorContainer = document.createElement('div');
      errorContainer.style.cssText = `
        padding: 15px;
        color: #d32f2f;
        text-align: center;
        font-size: 14px;
      `;
      errorContainer.textContent = errorMsg;
      
      // Add to popup
      popup.appendChild(errorContainer);
    },
    args: [errorMessage]
  }).catch(err => {
    console.error("Script injection error:", err);
    // If we can't update the popup, show an alert
    alert("Error: " + errorMessage);
  });
}

// Load API key on startup
chrome.storage.local.get("geminiApiKey", (data) => {
  if (data.geminiApiKey) {
    apiKey = data.geminiApiKey;
    console.log("API key loaded from storage");
  } else {
    console.log("No API key found in storage");
  }
});

// Function to analyze cloud provider and find Google Cloud equivalents
async function analyzeCloudProvider(pageContent, url, tabId) {
  try {
    console.log("Calling Gemini API with gemini-2.0-flash model");
    
    // Limit content length to avoid exceeding API limits
    const truncatedContent = pageContent.substring(0, 10000);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a cloud computing expert. Analyze this webpage content from ${url} and provide:

1. A table with three columns: "Original Product", "GCP Equivalent", and "Key Differences". List only product names in the first two columns, and brief key differences in the third column.

2. Step-by-step instructions for implementing the same functionality in Google Cloud Platform.

3. A list of documentation links to relevant Google Cloud resources.

IMPORTANT: Format your response directly as HTML with inline styles. DO NOT include any markdown code block markers like \`\`\`html or \`\`\` in your response. Your response should start directly with the HTML content.

<div style="color: black;">
  <h2 style="color: black;">Product Comparison</h2>
  <table style="width: 100%; border-collapse: collapse; margin: 15px 0; color: black;">
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; color: black;">Original Product</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; color: black;">GCP Equivalent</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; color: black;">Key Differences</th>
    </tr>
    <tr style="background-color: white;">
      <td style="border: 1px solid #ddd; padding: 8px; color: black;">Product 1</td>
      <td style="border: 1px solid #ddd; padding: 8px; color: black;">GCP Product 1</td>
      <td style="border: 1px solid #ddd; padding: 8px; color: black;">Key difference 1</td>
    </tr>
  </table>
  
  <h2 style="color: black;">Implementation in Google Cloud</h2>
  <ol style="margin: 10px 0; padding-left: 25px; color: black;">
    <li style="margin-bottom: 5px; color: black;">Step 1</li>
    <li style="margin-bottom: 5px; color: black;">Step 2</li>
  </ol>
  
  <h2 style="color: black;">Documentation Links</h2>
  <ul style="margin: 10px 0; padding-left: 25px; color: black;">
    <li style="margin-bottom: 5px; color: black;"><a href="https://cloud.google.com/docs" style="color: #4285F4; text-decoration: none;">Google Cloud Documentation</a></li>
  </ul>
</div>

The webpage content is: ${truncatedContent}

Use Google Search to ground your response with accurate and up-to-date information about Google Cloud products and services.`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    const data = await response.json();
    console.log("API response received");
    
    if (data.error) {
      console.error("API error:", data.error);
      updatePopupWithError(tabId, "Gemini API Error: " + (data.error.message || "Error calling Gemini API"));
      return;
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error("Unexpected API response format:", data);
      updatePopupWithError(tabId, "Unexpected API response format");
      return;
    }

    let analysis = data.candidates[0].content.parts[0].text;
    
    // Remove any markdown code block markers if they exist
    analysis = analysis.replace(/```html\s*/g, '');
    analysis = analysis.replace(/```\s*$/g, '');
    
    console.log("Analysis generated:", analysis.substring(0, 50) + "...");
    
    // Update the popup with the results
    updatePopupWithResults(tabId, analysis);
    
  } catch (error) {
    console.error("API call failed:", error);
    updatePopupWithError(tabId, "Failed to connect to Gemini API: " + error.message);
  }
}

// Function to update the popup with results
function updatePopupWithResults(tabId, htmlContent) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (content) => {
      // Get the existing popup
      const popup = document.getElementById('gemini-cloud-popup');
      if (!popup) {
        console.error("Popup not found");
        return;
      }
      
      // Remove the loading message
      const loadingMsg = document.getElementById('loading-message');
      if (loadingMsg) {
        loadingMsg.remove();
      }
      
      // Create content container
      const contentContainer = document.createElement('div');
      contentContainer.id = 'analysis-content';
      contentContainer.style.cssText = `
        padding: 10px;
        color: black;
        background-color: white;
      `;
      
      // Set the HTML content directly
      contentContainer.innerHTML = content;
      
      // Add CSS to ensure proper styling
      const style = document.createElement('style');
      style.textContent = `
        #gemini-cloud-popup {
          color: black !important;
          background-color: white !important;
        }
        #gemini-cloud-popup * {
          color: black !important;
        }
        #gemini-cloud-popup h1, 
        #gemini-cloud-popup h2, 
        #gemini-cloud-popup h3 {
          color: black !important;
        }
        #gemini-cloud-popup table th {
          background-color: #f2f2f2 !important;
        }
        #gemini-cloud-popup a {
          color: #4285F4 !important;
        }
      `;
      
      // Add the style and content to the popup
      document.head.appendChild(style);
      popup.appendChild(contentContainer);
    },
    args: [htmlContent]
  }).catch(err => {
    console.error("Script injection error:", err);
    updatePopupWithError(tabId, "Failed to display results: " + err.message);
  });
}

// Function to update the popup with an error message
function updatePopupWithError(tabId, errorMessage) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (errorMsg) => {
      // Get the existing popup
      const popup = document.getElementById('gemini-cloud-popup');
      if (!popup) {
        console.error("Popup not found");
        return;
      }
      
      // Remove the loading message
      const loadingMsg = document.getElementById('loading-message');
      if (loadingMsg) {
        loadingMsg.remove();
      }
      
      // Create error message
      const errorContainer = document.createElement('div');
      errorContainer.style.cssText = `
        padding: 20px;
        color: #d32f2f;
        text-align: center;
        font-size: 16px;
      `;
      errorContainer.textContent = errorMsg;
      
      // Add to popup
      popup.appendChild(errorContainer);
    },
    args: [errorMessage]
  }).catch(err => {
    console.error("Script injection error:", err);
    // If we can't update the popup, show an alert
    alert("Error: " + errorMessage);
  });
} 