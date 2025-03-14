document.addEventListener('DOMContentLoaded', function() {
  // Load saved API key if it exists
  chrome.storage.local.get('geminiApiKey', function(data) {
    if (data.geminiApiKey) {
      document.getElementById('api-key').value = data.geminiApiKey;
    }
  });
  
  // Save API key when button is clicked
  document.getElementById('save-button').addEventListener('click', function() {
    const apiKey = document.getElementById('api-key').value.trim();
    
    if (apiKey) {
      // Save to storage
      chrome.storage.local.set({ geminiApiKey: apiKey });
      
      // Send to background script
      chrome.runtime.sendMessage(
        { action: "setApiKey", apiKey: apiKey },
        function(response) {
          if (response && response.success) {
            // Show success message
            const successMsg = document.getElementById('success-message');
            successMsg.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(function() {
              successMsg.style.display = 'none';
            }, 3000);
          }
        }
      );
    }
  });
  
  // Add analyze button functionality
  const analyzeButton = document.createElement('button');
  analyzeButton.textContent = 'Translate to Google Cloud';
  analyzeButton.style.marginTop = '15px';
  analyzeButton.style.backgroundColor = '#34A853';
  
  analyzeButton.addEventListener('click', function() {
    // Get the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      // Extract page content
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        function: () => {
          // Get the page content
          const pageContent = document.body.innerText;
          const url = window.location.href;
          
          // Return the data
          return { pageContent, url };
        }
      }).then(results => {
        const { pageContent, url } = results[0].result;
        
        // Send to background script for analysis
        chrome.runtime.sendMessage({
          action: "analyzeWebpage",
          pageContent: pageContent,
          url: url,
          tabId: currentTab.id
        }, function(response) {
          if (response && response.error) {
            alert(response.error);
          } else {
            // Close the popup
            window.close();
          }
        });
      }).catch(err => {
        console.error("Script injection error:", err);
        alert("Failed to extract page content: " + err.message);
      });
    });
  });
  
  // Add the button to the popup
  document.body.appendChild(analyzeButton);
}); 