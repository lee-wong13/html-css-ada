// ============================================
// DYNAMIC PRODUCTS FOR INDEX PAGE
// Fetch and display products from Noroff API
// ============================================

// FUNCTION: Load New Arrival Products
function loadNewArrivalProducts() {
  var container = document.querySelector('.new-arrival .product-grid');
  
  if (!container) {
    return;
  }
  
  // Make API request for all products
  apiRequest(API_CONFIG.endpoints.allProducts,
    // Success callback
    function(response) {
      var products = response.data;
      
      if (!products || products.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:40px;">No products available</p>';
        return;
      }
      
      // Clear existing content
      container.innerHTML = '';
      
      // Show first 3 products as "New Arrival"
      for (var i = 0; i < Math.min(3, products.length); i++) {
        var product = products[i];
        var html = createIndexProductCard(product);
        container.innerHTML += html;
      }
    },
    // Error callback
    function(errorMessage) {
      container.innerHTML = '<p style="text-align:center; color: #ff6b6b;">❌ ' + errorMessage + '</p>';
    }
  );
}

// FUNCTION: Load Sale/Special Price Products
function loadSaleProducts() {
  var container = document.querySelector('.sale .sale-card');
  
  if (!container) {
    return;
  }
  
  // Make API request for all products
  apiRequest(API_CONFIG.endpoints.allProducts,
    // Success callback
    function(response) {
      var products = response.data;
      
      if (!products || products.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:40px;">No products available</p>';
        return;
      }
      
      // Clear existing content
      container.innerHTML = '';
      
      // Filter products that are on sale (discountedPrice < price)
      var saleProducts = [];
      for (var i = 0; i < products.length; i++) {
        var product = products[i];
        if (product.onSale && product.discountedPrice < product.price) {
          saleProducts.push(product);
        }
      }
      
      // If we have on-sale products, show them. Otherwise show regular products
      var productsToShow = saleProducts.length > 0 ? saleProducts : products;
      
      // Show up to 3 sale items
      for (var i = 0; i < Math.min(3, productsToShow.length); i++) {
        var product = productsToShow[i];
        var html = createIndexSaleCard(product);
        container.innerHTML += html;
      }
    },
    // Error callback
    function(errorMessage) {
      container.innerHTML = '<p style="text-align:center; color: #ff6b6b;">❌ ' + errorMessage + '</p>';
    }
  );
}

// FUNCTION: Create HTML for Product Card on Index
function createIndexProductCard(product) {
  var title = product.title || 'Untitled Product';
  var price = product.price || 0;
  var imageURL = (product.image && product.image.url) ? product.image.url : '';
  var imageAlt = (product.image && product.image.alt) ? product.image.alt : title;
  var id = product.id || '';
  
  // Create clean URL-friendly name
  var urlName = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  var html = '';
  html += '<div class="product-card">';
  html += '<div class="pic">';
  html += '<img src="' + imageURL + '" alt="' + imageAlt + '">';
  html += '</div>';
  html += '<h3>' + title + '</h3>';
  html += '<p>' + price.toFixed(2) + ' NOK</p>';
  html += '<button class="view-product" onclick="location.href=\'product-detail.html?name=' + urlName + '&id=' + id + '\'">View Product</button>';
  html += '</div>';
  
  return html;
}

// FUNCTION: Create HTML for Sale Card on Index
function createIndexSaleCard(product) {
  var title = product.title || 'Untitled Product';
  var price = product.price || 0;
  var discountedPrice = product.discountedPrice || price;
  var onSale = product.onSale || false;
  var imageURL = (product.image && product.image.url) ? product.image.url : '';
  var imageAlt = (product.image && product.image.alt) ? product.image.alt : title;
  var id = product.id || '';
  
  // Calculate discount percentage
  var discountPercent = 0;
  if (onSale && discountedPrice < price) {
    discountPercent = Math.round(((price - discountedPrice) / price) * 100);
  }
  
  // Create clean URL-friendly name
  var urlName = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  var html = '';
  html += '<div class="sale-img">';
  html += '<div class="sale-per">';
  html += '<img src="' + imageURL + '" alt="' + imageAlt + '">';
  if (discountPercent > 0) {
    html += '<p>' + discountPercent + '%</p>';
  }
  html += '</div>';
  html += '<h2>' + title + '</h2>';
  html += '<div class="price-col">';
  
  // Show price (sale price first if on sale)
  if (onSale && discountedPrice < price) {
    html += '<p>' + discountedPrice.toFixed(2) + ' nok</p>';
    html += '<p class="sale-price">' + price.toFixed(2) + ' nok</p>';
  } else {
    html += '<p>' + price.toFixed(2) + ' nok</p>';
  }
  
  html += '</div>';
  html += '<button class="view-product" onclick="location.href=\'product-detail.html?name=' + urlName + '&id=' + id + '\'">View Product</button>';
  html += '</div>';
  
  return html;
}

// ============================================
// INITIALIZE: Load products when page loads
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadNewArrivalProducts();
    loadSaleProducts();
  });
} else {
  loadNewArrivalProducts();
  loadSaleProducts();
}
