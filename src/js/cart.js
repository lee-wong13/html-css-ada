// ============================================
// CART PAGE JAVASCRIPT - SIMPLE VERSION
// This file handles the cart.html page
// ============================================

// FUNCTION 1: Load and Display Cart Items
// This shows all the products in your cart on the page
function loadCart() {
  // Get cart data from browser storage
  var cart = getCart();
  
  // Find the cart header (the row with "Item, Price, Quantity, Total")
  var cartHeader = document.querySelector('.cart-header');
  
  // If cart header doesn't exist, stop here
  if (!cartHeader) {
    return;
  }
  
  // STEP 1: Remove old cart items from the page
  // Find all elements with class "cart-item"
  var oldItems = document.querySelectorAll('.cart-item');
  for (var i = 0; i < oldItems.length; i++) {
    oldItems[i].remove(); // Delete them
  }
  
  // STEP 2: If cart is empty, show empty message
  if (cart.length === 0) {
    var emptyMessage = '<div class="cart-item max-width" style="text-align: center; padding: 40px;">';
    emptyMessage += '<p>Your cart is empty. <a href="product.html">Continue shopping</a></p>';
    emptyMessage += '</div>';
    
    cartHeader.insertAdjacentHTML('afterend', emptyMessage);
    updateCartSummary(); // Update totals to show 0
    return; // Stop here
  }
  
  // STEP 3: Show each item in the cart
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    
    // Check if item has required data
    if (!item.name || !item.price) {
      continue; // Skip invalid items
    }
    
    var itemTotal = item.price * item.quantity; // Calculate item total
    
    // Create HTML for this cart item
    var itemHTML = '<div class="cart-item max-width" data-index="' + i + '">';
    
    // Column 1: Product image and name
    itemHTML += '<div class="col item">';
    itemHTML += '<img src="' + (item.image || 'assets/images/placeholder.jpg') + '" alt="' + item.name + '" style="max-width: 50px;">';
    itemHTML += '<div>';
    itemHTML += '<p class="desc">' + item.name + '</p>';
    itemHTML += '<p class="desc-detail">• size ' + (item.size || 'N/A') + '<br>• ' + (item.color || 'N/A') + '</p>';
    itemHTML += '</div>';
    itemHTML += '</div>';
    
    // Column 2: Price
    itemHTML += '<div class="col price">';
    itemHTML += '<p>' + item.price + '</p>';
    itemHTML += '</div>';
    
    // Column 3: Quantity with + and - buttons
    itemHTML += '<div class="col quantity">';
    itemHTML += '<button class="option decrease-qty" data-index="' + i + '">−</button>';
    itemHTML += '<input class="option quantity-input" value="' + item.quantity + '" readonly>';
    itemHTML += '<button class="option increase-qty" data-index="' + i + '">+</button>';
    itemHTML += '</div>';
    
    // Column 4: Total for this item
    itemHTML += '<div class="col total">';
    itemHTML += '<p>' + Math.round(itemTotal) + '</p>';
    itemHTML += '</div>';
    
    itemHTML += '</div>';
    
    // Add this item HTML after the cart header
    cartHeader.insertAdjacentHTML('afterend', itemHTML);
  }
  
  // STEP 4: Make the + and - buttons work
  attachQuantityListeners();
  
  // STEP 5: Calculate and show totals
  updateCartSummary();
}

// FUNCTION 2: Make Quantity Buttons Work
// This adds click events to all + and - buttons
function attachQuantityListeners() {
  
  // Find all "increase" (+) buttons
  var increaseButtons = document.querySelectorAll('.increase-qty');
  for (var i = 0; i < increaseButtons.length; i++) {
    increaseButtons[i].addEventListener('click', function() {
      // Get which item was clicked (0, 1, 2, etc.)
      var index = Number(this.getAttribute('data-index'));
      updateQuantity(index, 1); // Add 1 to quantity
    });
  }
  
  // Find all "decrease" (-) buttons
  var decreaseButtons = document.querySelectorAll('.decrease-qty');
  for (var i = 0; i < decreaseButtons.length; i++) {
    decreaseButtons[i].addEventListener('click', function() {
      // Get which item was clicked
      var index = Number(this.getAttribute('data-index'));
      updateQuantity(index, -1); // Subtract 1 from quantity
    });
  }
}

// FUNCTION 3: Update Item Quantity
// This changes how many of an item you want
// index = which item (0 = first, 1 = second, etc.)
// change = +1 to add, -1 to subtract
function updateQuantity(index, change) {
  // Get current cart
  var cart = getCart();
  
  // Check if this item exists in cart
  if (cart[index]) {
    
    // Change the quantity
    cart[index].quantity = cart[index].quantity + change;
    
    // If quantity becomes 0 or less, remove item from cart
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1); // Remove this item
    }
    
    // Save updated cart
    saveCart(cart);
    
    // Reload the page to show changes
    loadCart();
  }
}

// FUNCTION 4: Calculate and Display Totals
// This shows the subtotal, tax, and total at the bottom
function updateCartSummary() {
  // Get cart
  var cart = getCart();
  
  // Calculate subtotal (add up all items)
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var itemTotal = cart[i].price * cart[i].quantity;
    subtotal = subtotal + itemTotal;
  }
  
  // Calculate shipping (free for now)
  var shipping = 0;
  
  // Calculate tax (25% of subtotal)
  var tax = Math.round(subtotal * 0.25);
  
  // Calculate final total
  var total = subtotal + shipping + tax;
  
  // Find elements on page where we show these numbers
  var subtotalElement = document.querySelector('.subtotal h1:last-child');
  var shippingElement = document.querySelector('.shipping p:last-child');
  var taxElement = document.querySelector('.tax p:last-child');
  var totalElement = document.querySelector('.total h1:last-child');
  
  // Update the numbers on the page
  if (subtotalElement) subtotalElement.textContent = Math.round(subtotal);
  if (shippingElement) shippingElement.textContent = shipping;
  if (taxElement) taxElement.textContent = tax;
  if (totalElement) totalElement.textContent = total;
}

// ============================================
// INITIALIZE: Run when cart page loads
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCart);
} else {
  loadCart();
}
