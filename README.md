# Google Cloud Helper Chrome Extension

A Chrome extension that helps users transitioning from other cloud providers to Google Cloud Platform by providing equivalent services and documentation.

## Features

- Right-click on any cloud service term and select "Find the Google Cloud equivalent" to instantly get the GCP equivalent product
- Access official Google Cloud documentation directly from the extension
- Translate entire implementation guides from other cloud providers (AWS, Azure, etc.) to Google Cloud with a single click using "Translate to Google Cloud"
- Powered by Gemini AI for accurate and contextual cloud service mapping

## Installation

1. Clone this repository
2. Get your API key:
   - Go to [Google AI Studio](https://aistudio.google.com/apikey)
   - Click on "Create API key"
   - Copy the generated API key
   - Add the API key to the extension configuration (details in the Development section)
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right corner
5. Click "Load unpacked" and select the project directory
6. The extension should now be installed and active

## Usage

### Finding Equivalent Services
1. Right-click on any cloud service name (e.g., "AWS Lambda", "Azure Functions")
2. Select "Find the Google Cloud equivalent" from the context menu
3. View the Google Cloud equivalent service along with documentation links

### Translating Implementation Guides
1. Navigate to any article or implementation guide for another cloud provider
2. Click the "Translate to Google Cloud" option
3. Get a complete translation of the implementation steps for Google Cloud

## Files

- `manifest.json`: Extension configuration
- `popup.html` & `popup.js`: UI for the extension popup
- `content.js`: Scripts that run on web pages to enable context menu functionality
- `background.js`: Background processing scripts for handling API requests to Gemini AI

## Development

### API Key Configuration

After obtaining your API key from Google AI Studio:

1. Open `background.js` in your code editor
2. Locate the API key configuration section (usually near the top of the file)
3. Replace the placeholder value with your actual API key:
   ```javascript
   const API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   ```

### Making Changes

To modify this extension:

1. Edit the files as needed
2. Reload the extension in `chrome://extensions/` by clicking the refresh icon
3. Test your changes

### Security Note

Never commit your API key to a public repository. Consider using environment variables or a secure configuration method for production deployments.

## License

MIT
