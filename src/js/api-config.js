// ============================================
// LOADING INDICATOR FUNCTION
// ============================================

// FUNCTION: Show Loading Indicator
function showLoadingIndicator() {
  var existingLoader = document.getElementById('api-loading-indicator');
  
  // Don't create multiple loaders
  if (existingLoader) {
    return;
  }
  
  var loaderHTML = '<div id="api-loading-indicator" style="' +
    'position: fixed;' +
    'top: 0;' +
    'left: 0;' +
    'right: 0;' +
    'bottom: 0;' +
    'background: rgba(0, 0, 0, 0.5);' +
    'display: flex;' +
    'justify-content: center;' +
    'align-items: center;' +
    'z-index: 9999;' +
    '">' +
    '<div style="' +
      'background: white;' +
      'padding: 30px;' +
      'border-radius: 8px;' +
      'text-align: center;' +
    '">' +
      '<div style="' +
        'border: 4px solid #f3f3f3;' +
        'border-top: 4px solid #007bff;' +
        'border-radius: 50%;' +
        'width: 40px;' +
        'height: 40px;' +
        'animation: spin 1s linear infinite;' +
        'margin: 0 auto 15px;' +
      '"></div>' +
      '<p style="margin: 0; color: #333; font-weight: bold;">Loading...</p>' +
    '</div>' +
    '<style>' +
      '@keyframes spin {' +
        '0% { transform: rotate(0deg); }' +
        '100% { transform: rotate(360deg); }' +
      '}' +
    '</style>' +
    '</div>';
  
  document.body.insertAdjacentHTML('beforeend', loaderHTML);
}

// FUNCTION: Hide Loading Indicator
function hideLoadingIndicator() {
  var loader = document.getElementById('api-loading-indicator');
  if (loader) {
    loader.remove();
  }
}

// ============================================
// NOROFF RAINY DAYS API CONFIGURATION
// ============================================

// API Configuration
var API_CONFIG = {
  // Base URL for Noroff API
  baseURL: 'https://v2.api.noroff.dev',
  
  // Endpoints (URLs) we'll use
  endpoints: {
    allProducts: '/rainy-days',           // Get all products
    singleProduct: '/rainy-days/'         // Get one product (add ID at end)
  }
};

// ============================================
// FUNCTION: Make API Request with Error Handling (Async/Await)
// This is a simple helper to fetch data from API
// ============================================
async function apiRequest(endpoint, callback, errorCallback) {
  // Show loading indicator
  showLoadingIndicator();
  
  try {
    // Combine base URL with endpoint
    var fullURL = API_CONFIG.baseURL + endpoint;
    
    // Make the request using fetch
    var response = await fetch(fullURL);
    
    // Check if request was successful
    if (!response.ok) {
      // Server returned an error (404, 500, etc)
      throw new Error('Error ' + response.status + ': ' + response.statusText);
    }
    
    // Convert response to JSON
    var data = await response.json();
    
    // Hide loading indicator
    hideLoadingIndicator();
    
    // Call the success callback function with the data
    callback(data);
    
  } catch(error) {
    // Hide loading indicator
    hideLoadingIndicator();
    
    // If something goes wrong, handle the error
    var errorMessage = error.message || 'Failed to load data. Please try again later.';
    
    // Call error callback if provided
    if (errorCallback) {
      errorCallback(errorMessage);
    } else {
      // Default error handling
      alert('Error: ' + errorMessage);
    }
  }
}
