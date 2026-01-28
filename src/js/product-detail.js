// ============================================
// PRODUCT DETAIL PAGE - SIMPLE VERSION
// This loads a single product from the API
// ============================================

// FUNCTION: Get Product ID from URL
// Example: product-detail.html?name=rainy-days-akra-jacket&id=abc123
// This function extracts the ID
function getProductIdFromURL() {
  // Get the URL query string (everything after ?)
  var queryString = window.location.search;
  
  // Create URLSearchParams to easily read parameters
  var params = new URLSearchParams(queryString);
  
  // Get the 'id' parameter (we need ID to fetch from API)
  var productId = params.get('id');
  
  // Get the 'name' parameter (this is just for nice URLs)
  var productName = params.get('name');
  
  return productId;
}

// FUNCTION: Load and Display Single Product
function loadProductDetail() {
  
  // STEP 1: Get product ID from URL
  var productId = getProductIdFromURL();
  
  // Check if we have an ID
  if (!productId) {
    showError('No product ID provided. Please select a product from the shop.');
    return;
  }
  
  // STEP 2: Make API request for this specific product
  var endpoint = API_CONFIG.endpoints.singleProduct + productId;
  
  apiRequest(endpoint,
    // Success callback
    function(response) {
      // Get the product data
      var product = response.data;
      
      // Check if product exists
      if (!product) {
        showError('Product not found.');
        return;
      }
      
      // STEP 3: Display the product
      displayProduct(product);
    },
    // Error callback
    function(errorMessage) {
      showError('❌ ' + errorMessage);
    }
  );
}

// FUNCTION: Display Product Details on Page
function displayProduct(product) {
  
  // Get product details
  var id = product.id || '';
  var title = product.title || 'Untitled Product';
  var description = product.description || 'No description available.';
  var gender = product.gender || '';
  var sizes = product.sizes || [];
  var baseColor = product.baseColor || '';
  var price = product.price || 0;
  var discountedPrice = product.discountedPrice || price;
  var onSale = product.onSale || false;
  var imageURL = (product.image && product.image.url) ? product.image.url : '';
  var imageAlt = (product.image && product.image.alt) ? product.image.alt : title;
  var tags = product.tags || [];
  
  // Update page title in breadcrumb
  var breadcrumbTitle = document.getElementById('breadcrumb-title');
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = title;
  }
  
  // Update browser title
  document.title = title + ' - Rainy Days';
  
  // Build product HTML matching original design exactly
  var html = '';
  
  // Left side: Product images with original structure
  html += '<div class="show-item-product">';
  html += '<div class="main-product-review-product">';
  html += '<img src="' + imageURL + '" alt="' + imageAlt + '">';
  html += '</div>';
  html += '<div class="other-product-review-product">';
  html += '<img src="' + imageURL + '" alt="' + imageAlt + '">';
  html += '<img src="' + imageURL + '" alt="' + imageAlt + '">';
  html += '<img src="' + imageURL + '" alt="' + imageAlt + '">';
  html += '<img src="' + imageURL + '" alt="' + imageAlt + '">';
  html += '<div class="arrow-down-product">';
  html += '<i class="ri-arrow-down-s-line"></i>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  
  // Right side: Product details - ORIGINAL STRUCTURE
  html += '<div class="product-item-layout-product">';
  html += '<div class="product-item-product">';
  html += '<h1>' + title + '</h1>';
  
  // Show price in original format
  html += '<h3>' + (onSale ? discountedPrice.toFixed(2) : price.toFixed(2)) + ' NOK</h3>';
  
  html += '<p>' + description + '</p>';
  
  // Size and Color selectors - ORIGINAL STRUCTURE
  html += '<div class="choose-size-color-product">';
  
  // Size dropdown
  html += '<div class="size-product">';
  html += '<div class="dropdown">';
  html += '<div class="select">';
  html += '<span>Size</span>';
  html += '<i class="fa fa-chevron-left">&#x2C5;</i>';
  html += '</div>';
  html += '<input type="hidden" name="gender">';
  html += '<ul class="dropdown-menu">';
  
  // Add all available sizes
  for (var i = 0; i < sizes.length; i++) {
    html += '<li id="' + sizes[i] + '">' + sizes[i] + '</li>';
  }
  
  html += '</ul>';
  html += '</div>';
  html += '<!-- dropdown credit : https://codepen.io/AleksDev-/pen/PwZaZZb -->';
  html += '</div>';
  
  // Color dropdown (using baseColor)
  html += '<div class="color-product">';
  html += '<div class="dropdown">';
  html += '<div class="select">';
  html += '<span>Color</span>';
  html += '<i class="fa fa-chevron-left">&#x2C5</i>';
  html += '</div>';
  html += '<input type="hidden" name="gender">';
  html += '<ul class="dropdown-menu">';
  html += '<li id="' + baseColor + '">' + baseColor + '</li>';
  html += '</ul>';
  html += '</div>';
  html += '<!-- dropdown credit : https://codepen.io/AleksDev-/pen/PwZaZZb -->';
  html += '</div>';
  
  html += '</div>'; // close choose-size-color-product
  html += '</div>'; // close product-item-product
  
  // Add to cart buttons - ORIGINAL STRUCTURE
  html += '<div class="add-to-btn-product">';
  html += '<button class="btn" type="button">Add to Wishist</button>';
  html += '<button class="btn" type="button" id="addToCartBtn" data-product-id="' + id + '" data-product-title="' + title.replace(/"/g, '&quot;') + '" data-product-price="' + (onSale ? discountedPrice : price) + '" data-product-image="' + imageURL.replace(/"/g, '&quot;') + '">Add to Cart</button>';
  html += '</div>';
  
  html += '</div>'; // close product-item-layout-product
  
  // Insert HTML into page
  var container = document.getElementById('product-container');
  if (container) {
    container.innerHTML = html;
  }
  
  // Add accordion sections AFTER the main product section
  addAccordionSections(product);
}

// FUNCTION: Add Accordion Sections (Details, Materials, Size Guide, Care)
function addAccordionSections(product) {
  var sizes = product.sizes || [];
  var gender = product.gender || '';
  var baseColor = product.baseColor || '';
  
  var html = '<section class="accordion container">';
  
  // Detail Description
  html += '<details>';
  html += '<summary>Detail Description</summary>';
  html += '<ul>';
  html += '<li>Waterproof & Windproof</li>';
  html += '<li>Premium Thermal Insulation</li>';
  html += '<li>Multiple Secure Pockets</li>';
  html += '<li>Adjustable Waist Belt & Hood</li>';
  html += '<li>High-Visibility Reflective Strips</li>';
  html += '<li>Durable Outdoor Performance</li>';
  html += '</ul>';
  html += '</details>';
  
  // Materials
  html += '<details>';
  html += '<summary>Materials</summary>';
  html += '<ul>';
  html += '<li>Material : High-performance polyester with waterproof coating</li>';
  html += '<li>Inner Lining : Insulated thermal fleece</li>';
  html += '<li>Waterproof Rating : 15,000mm</li>';
  html += '<li>Windproof : Yes</li>';
  html += '<li>Breathable : Yes</li>';
  html += '<li>Pockets : 4 secure zipped pockets + 1 inner pocket</li>';
  html += '<li>Available : ' + baseColor + '</li>';
  html += '</ul>';
  html += '</details>';
  
  // Size Guide
  html += '<details>';
  html += '<summary>Size Guide</summary>';
  html += '<ul>';
  html += '<li>Available Sizes : ' + sizes.join(' &#8226 ') + '</li>';
  html += '</ul>';
  html += '</details>';
  
  // Care Instructions
  html += '<details>';
  html += '<summary>Care Instruction</summary>';
  html += '<ul>';
  html += '<li>Machine wash cold(30&degC)</li>';
  html += '<li>Use mild detergent only</li>';
  html += '<li>Do not bleach or use fabric softeners</li>';
  html += '<li>Close all zippers before washing</li>';
  html += '<li>Air dry in shade, avoid direct heat</li>';
  html += '<li>Do not iron or dry clean</li>';
  html += '<li>Reapply DWR spray periodically to maintain waterproofing</li>';
  html += '</ul>';
  html += '</details>';
  
  html += '</section>';
  html += '<!-- credit : https://codepen.io/nefejames/pen/myerjvJ -->';
  
  // Insert after product section
  var container = document.getElementById('product-container');
  if (container) {
    container.insertAdjacentHTML('afterend', html);
  }
  
  // Initialize dropdowns after HTML is added
  initializeDropdowns();
}

// FUNCTION: Initialize Dropdown Menus
// This makes the size and color dropdowns work
function initializeDropdowns() {
  // Wait a tiny bit for HTML to be ready
  setTimeout(function() {
    
    // Dropdown click - open/close menu
    $('.dropdown').off('click').on('click', function () {
      $(this).attr('tabindex', 1).focus();
      $(this).toggleClass('active');
      $(this).find('.dropdown-menu').slideToggle(300);
    });
    
    // Dropdown focus out - close menu
    $('.dropdown').off('focusout').on('focusout', function () {
      $(this).removeClass('active');
      $(this).find('.dropdown-menu').slideUp(300);
    });
    
    // Dropdown item click - select option
    $('.dropdown .dropdown-menu li').off('click').on('click', function () {
      $(this).parents('.dropdown').find('span').text($(this).text());
      $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
    });
    
    // Handle Add to Cart button click
    var addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        var productTitle = this.getAttribute('data-product-title');
        var productPrice = this.getAttribute('data-product-price');
        var productImage = this.getAttribute('data-product-image');
        
        var size = document.querySelector('.size-product .select span').textContent;
        var color = document.querySelector('.color-product .select span').textContent;
        
        addToCart(productTitle, productPrice, productImage, size, color);
      });
    }
    
  }, 100);
}

// FUNCTION: Show Error Message
function showError(message) {
  var container = document.getElementById('product-container');
  if (container) {
    container.innerHTML = '<div style="text-align: center; padding: 60px;">';
    container.innerHTML += '<p style="color: red;">' + message + '</p>';
    container.innerHTML += '<p><a href="product.html">Back to Shop</a></p>';
    container.innerHTML += '</div>';
  }
}

// ============================================
// INITIALIZE: Load product when page loads
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProductDetail);
} else {
  loadProductDetail();
}
