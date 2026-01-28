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
// FUNCTION: Make API Request
// This is a simple helper to fetch data from API
// ============================================
function apiRequest(endpoint, callback) {
  // Combine base URL with endpoint
  var fullURL = API_CONFIG.baseURL + endpoint;
  
  // Make the request using fetch
  fetch(fullURL)
    .then(function(response) {
      // Check if request was successful
      if (!response.ok) {
        throw new Error('API Error: ' + response.status);
      }
      // Convert response to JSON
      return response.json();
    })
    .then(function(data) {
      // Call the callback function with the data
      callback(data);
    })
    .catch(function(error) {
      // If something goes wrong, show error
      console.error('API Request Failed:', error);
      alert('Failed to load products. Please try again later.');
    });
}
