// ============================================
// PRODUCT FILTER JAVASCRIPT - SIMPLE VERSION
// This makes the filter checkboxes work on product page
// ============================================

// FUNCTION 1: Filter Products
// This shows/hides products based on what filters are checked
function filterProducts() {
  
  // STEP 1: Get all checked filters
  // Get all checkboxes that are checked
  var checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  
  // Create arrays to store what's checked in each category
  var selectedGenders = [];    // men, women
  var selectedCategories = []; // rain, jacket, fleece
  var selectedSizes = [];      // xs, s, m, l
  var selectedPrices = [];     // 0-500, 500-2000, 2000-4000
  
  // STEP 2: Sort checkboxes into categories
  // Loop through all checked boxes
  for (var i = 0; i < checkedBoxes.length; i++) {
    var value = checkedBoxes[i].value;
    
    // Check which category this checkbox belongs to
    if (value === 'male' || value === 'female') {
      selectedGenders.push(value);
    }
    else if (value === 'jacket' || value === 'womens' || value === 'mens') {
      selectedCategories.push(value);
    }
    else if (value.includes('size-')) {
      // Extract size (xs, s, m, l, xl, xxl) from "size-xs"
      var size = value.replace('size-', '');
      selectedSizes.push(size);
    }
    else if (value.includes('-')) {
      // This is a price range like "0-100"
      selectedPrices.push(value);
    }
  }
  
  // STEP 3: Get all product items
  var allProducts = document.querySelectorAll('.product .item');
  
  // STEP 4: Check each product to see if it should be shown
  for (var i = 0; i < allProducts.length; i++) {
    var product = allProducts[i];
    
    // Get product's attributes
    var productGender = product.getAttribute('data-gender');     // "men women"
    var productCategory = product.getAttribute('data-category'); // "rain jacket"
    var productSizes = product.getAttribute('data-size');        // "xs s m l"
    var productPrice = Number(product.getAttribute('data-price')); // 850
    
    var shouldShow = true; // Start by assuming we'll show this product
    
    // CHECK 1: Gender filter
    if (selectedGenders.length > 0) {
      var genderMatch = false;
      // Check if product matches any selected gender
      for (var j = 0; j < selectedGenders.length; j++) {
        if (productGender.includes(selectedGenders[j])) {
          genderMatch = true;
          break;
        }
      }
      // If no match, hide product
      if (!genderMatch) {
        shouldShow = false;
      }
    }
    
    // CHECK 2: Category filter
    if (selectedCategories.length > 0 && shouldShow) {
      var categoryMatch = false;
      // Check if product matches any selected category
      for (var j = 0; j < selectedCategories.length; j++) {
        if (productCategory.includes(selectedCategories[j])) {
          categoryMatch = true;
          break;
        }
      }
      // If no match, hide product
      if (!categoryMatch) {
        shouldShow = false;
      }
    }
    
    // CHECK 3: Size filter
    if (selectedSizes.length > 0 && shouldShow) {
      var sizeMatch = false;
      // Check if product has any of the selected sizes
      for (var j = 0; j < selectedSizes.length; j++) {
        if (productSizes.includes(selectedSizes[j])) {
          sizeMatch = true;
          break;
        }
      }
      // If no match, hide product
      if (!sizeMatch) {
        shouldShow = false;
      }
    }
    
    // CHECK 4: Price filter
    if (selectedPrices.length > 0 && shouldShow) {
      var priceMatch = false;
      
      // Check each selected price range
      for (var j = 0; j < selectedPrices.length; j++) {
        var range = selectedPrices[j].split('-'); // Split "0-500" into ["0", "500"]
        var minPrice = Number(range[0]);
        var maxPrice = Number(range[1]);
        
        // Check if product price is in this range
        if (productPrice >= minPrice && productPrice <= maxPrice) {
          priceMatch = true;
          break;
        }
      }
      
      // If no match, hide product
      if (!priceMatch) {
        shouldShow = false;
      }
    }
    
    // STEP 5: Show or hide the product
    if (shouldShow) {
      product.style.display = 'block'; // Show product
    } else {
      product.style.display = 'none';  // Hide product
    }
  }
}

// FUNCTION 2: Sort Products
// This changes the order of products based on dropdown selection
function sortProducts(sortType) {
  
  // Get the product container
  var productContainer = document.querySelector('.product');
  
  // Get all product items as an array
  var products = Array.from(document.querySelectorAll('.product .item'));
  
  // Sort the products based on selected option
  if (sortType === 'low-to-high') {
    // Sort from lowest to highest price
    products.sort(function(a, b) {
      var priceA = Number(a.getAttribute('data-price'));
      var priceB = Number(b.getAttribute('data-price'));
      return priceA - priceB; // Lower price first
    });
  }
  else if (sortType === 'high-to-low') {
    // Sort from highest to lowest price
    products.sort(function(a, b) {
      var priceA = Number(a.getAttribute('data-price'));
      var priceB = Number(b.getAttribute('data-price'));
      return priceB - priceA; // Higher price first
    });
  }
  else if (sortType === 'popular' || sortType === 'newest') {
    // For now, just show in original order
    // You can add more logic here later
  }
  
  // Remove all products from container
  productContainer.innerHTML = '';
  
  // Add products back in new order
  for (var i = 0; i < products.length; i++) {
    productContainer.appendChild(products[i]);
  }
}

// ============================================
// INITIALIZE: Add Event Listeners
// ============================================

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  initializeFilters();
}

function initializeFilters() {
  
  // Add event listeners to all filter checkboxes
  var checkboxes = document.querySelectorAll('.accordion-filter input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', filterProducts);
  }
  
  // Add event listener to sort dropdown
  var sortItems = document.querySelectorAll('.dropdown-menu li');
  for (var i = 0; i < sortItems.length; i++) {
    sortItems[i].addEventListener('click', function() {
      var sortType = this.getAttribute('id');
      sortProducts(sortType);
    });
  }
}
