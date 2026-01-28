// ============================================
// LOAD PRODUCTS FROM NOROFF API - SIMPLE VERSION
// This file loads real products from the API
// ============================================

// API Response Structure:
// {
//   "data": [array of products],
//   "meta": {pagination info}
// }

// FUNCTION: Load All Products from API
function loadProductsFromAPI() {
  
  // Show loading message
  var productContainer = document.querySelector('.product');
  if (productContainer) {
    productContainer.innerHTML = '<p style="text-align:center; padding:40px;">Loading products...</p>';
  }
  
  // Make API request to get all products
  apiRequest(API_CONFIG.endpoints.allProducts, function(response) {
    
    // Get the products array from response.data
    var products = response.data;
    
    // Check if we got products
    if (!products || products.length === 0) {
      if (productContainer) {
        productContainer.innerHTML = '<p style="text-align:center; padding:40px;">No products found.</p>';
      }
      return;
    }
    
    // Clear loading message
    if (productContainer) {
      productContainer.innerHTML = '';
    }
    
    // Show total count if available
    if (response.meta && response.meta.totalCount) {
      console.log('Total products loaded: ' + response.meta.totalCount);
    }
    
    // Loop through each product and create HTML
    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      
      // Create product card HTML
      var productHTML = createProductCard(product);
      
      // Add to page
      if (productContainer) {
        productContainer.innerHTML += productHTML;
      }
    }
    
    // After products are loaded, initialize filters
    if (typeof initializeFilters === 'function') {
      initializeFilters();
    }
  });
}

// FUNCTION: Create HTML for One Product Card
function createProductCard(product) {
  
  // Get product details (with fallbacks for safety)
  var id = product.id || '';
  var title = product.title || 'Untitled Product';
  var price = product.price || 0;
  var discountedPrice = product.discountedPrice || price;
  var onSale = product.onSale || false;
  var imageURL = (product.image && product.image.url) ? product.image.url : '';
  var imageAlt = (product.image && product.image.alt) ? product.image.alt : title;
  var gender = product.gender ? product.gender.toLowerCase() : ''; // "Female" becomes "female"
  var sizes = product.sizes ? product.sizes.join(' ').toLowerCase() : ''; // ["XS", "S"] becomes "xs s"
  var tags = product.tags ? product.tags.join(' ') : ''; // ["jacket", "womens"] becomes "jacket womens"
  
  // Create a clean URL-friendly name from title
  // "Rainy Days Akra Jacket" becomes "rainy-days-akra-jacket"
  var urlName = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace spaces and special chars with dashes
    .replace(/^-+|-+$/g, '');      // Remove dashes from start/end
  
  // Start building HTML
  var html = '<div class="item"';
  
  // Add data attributes for filtering
  html += ' data-gender="' + gender + '"';
  html += ' data-category="' + tags + '"';
  html += ' data-size="' + sizes + '"';
  html += ' data-price="' + price + '"';
  html += ' data-id="' + id + '"';  // Store ID for reference
  html += '>';
  
  // Link with clean URL using product name
  html += '<a href="product-detail.html?name=' + urlName + '&id=' + id + '">';
  html += '<div class="card-product">';
  html += '<div class="pic">';
  html += '<img src="' + imageURL + '" alt="' + imageAlt + '">';
  html += '</div>';
  html += '<h1>' + title + '</h1>';
  
  // Show price (with sale price if on sale)
  html += '<p class="price">';
  if (onSale && discountedPrice < price) {
    // Show discounted price with original price crossed out
    html += discountedPrice.toFixed(2) + ' NOK ';
    html += '<span class="sale-price">' + price.toFixed(2) + ' NOK</span>';
  } else {
    // Regular price
    html += price.toFixed(2) + ' NOK';
  }
  html += '</p>';
  
  html += '</div>';
  html += '</a>';
  html += '</div>';
  
  return html;
}

// FUNCTION: Load Single Product Details
// Use this on individual product pages
function loadSingleProduct(productId, callback) {
  
  // Make API request for single product
  var endpoint = API_CONFIG.endpoints.singleProduct + productId;
  
  apiRequest(endpoint, function(response) {
    // Get the product data
    var product = response.data;
    
    // Call the callback function with product data
    if (callback) {
      callback(product);
    }
  });
}

// ============================================
// INITIALIZE: Load products when page loads
// ============================================

// Check if we're on the product listing page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Only load products if the product container exists
    if (document.querySelector('.product')) {
      loadProductsFromAPI();
    }
  });
} else {
  if (document.querySelector('.product')) {
    loadProductsFromAPI();
  }
}
