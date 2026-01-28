// ============================================
// SUCCESS PAGE - DISPLAY ORDER CONFIRMATION
// Show completed order details from checkout
// ============================================

// FUNCTION: Load Order Data on Success Page
function loadOrderConfirmation() {
  // Get the saved order data from localStorage
  var orderDataString = localStorage.getItem('lastOrder');
  
  if (!orderDataString) {
    // No order data found - redirect to shop
    alert('⚠️ No order found. Please complete checkout first.');
    window.location.href = 'product.html';
    return;
  }
  
  var orderData = JSON.parse(orderDataString);
  
  // Update order header with order number and date
  updateOrderHeader(orderData);
  
  // Display order items
  displayOrderItems(orderData);
  
  // Display shipping information
  displayShippingInfo(orderData);
}

// FUNCTION: Update Order Header
function updateOrderHeader(orderData) {
  var orderHeader = document.querySelector('.order-header p');
  if (orderHeader) {
    orderHeader.textContent = 'Order #' + orderData.orderNumber + ' | ' + orderData.orderDate;
  }
}

// FUNCTION: Display Order Items
function displayOrderItems(orderData) {
  var orderBox = document.querySelector('.order-box');
  if (!orderBox) {
    return;
  }
  
  // Find the total box (we'll insert items before it)
  var hrElement = orderBox.querySelector('.before-total');
  if (!hrElement) {
    return;
  }
  
  // Remove existing item elements
  var existingItems = orderBox.querySelectorAll('.item');
  for (var i = 0; i < existingItems.length; i++) {
    existingItems[i].remove();
  }
  
  // Add each item from the order
  for (var i = 0; i < orderData.cart.length; i++) {
    var item = orderData.cart[i];
    var itemHTML = createSuccessItemHTML(item);
    hrElement.insertAdjacentHTML('beforebegin', itemHTML);
  }
  
  // Update total section
  updateOrderTotal(orderData);
}

// FUNCTION: Create HTML for Order Item
function createSuccessItemHTML(item) {
  var name = item.name || 'Unknown Product';
  var price = Number(item.price) || 0;
  var quantity = Number(item.quantity) || 1;
  var size = item.size || 'N/A';
  var color = item.color || 'N/A';
  var image = item.image || 'assets/images/RainyDays_Jacket1.jpg';
  
  var itemTotal = price * quantity;
  
  var html = '';
  html += '<div class="item">';
  html += '<img src="' + image + '" alt="' + name + '">';
  html += '<div class="item-info">';
  html += '<p><strong>' + name + '</strong></p>';
  html += '<p>Size: ' + size.toUpperCase() + ' • ' + color + '</p>';
  html += '<p>' + quantity + ' piece' + (quantity > 1 ? 's' : '') + '</p>';
  html += '</div>';
  html += '<p class="price">' + itemTotal.toFixed(2) + ' NOK</p>';
  html += '</div>';
  
  return html;
}

// FUNCTION: Update Order Total
function updateOrderTotal(orderData) {
  var totalBox = document.querySelector('.total-box');
  if (!totalBox) {
    return;
  }
  
  // Update total amount
  var totalElement = totalBox.querySelector('.total-right h3');
  if (totalElement) {
    totalElement.textContent = orderData.total.toFixed(2);
  }
  
  // Update subtotal + shipping details
  var subtotalElement = totalBox.querySelector('.total-right p');
  if (subtotalElement) {
    subtotalElement.textContent = 'Subtotal: ' + orderData.subtotal.toFixed(2) + ' NOK + Shipping: ' + orderData.shippingCost.toFixed(2) + ' NOK';
  }
}

// FUNCTION: Display Shipping Information
function displayShippingInfo(orderData) {
  var shippingBox = document.querySelector('.shipping-box');
  if (!shippingBox) {
    return;
  }
  
  // Build full address
  var fullAddress = orderData.address;
  if (orderData.apt) {
    fullAddress += ', ' + orderData.apt;
  }
  fullAddress += ', ' + orderData.postalCode + ' ' + orderData.city;
  if (orderData.province) {
    fullAddress += ', ' + orderData.province;
  }
  fullAddress += ', ' + orderData.country;
  
  // Build shipping method text
  var shippingMethod = orderData.shippingMethod.name;
  if (orderData.shippingMethod.description) {
    shippingMethod += ' (' + orderData.shippingMethod.description + ')';
  }
  
  // Update the shipping info HTML
  var html = '';
  html += '<h2>Shipping</h2>';
  html += '<p><strong>Name:</strong> ' + orderData.firstName + ' ' + orderData.lastName + '</p>';
  html += '<p><strong>Email:</strong> ' + orderData.email + '</p>';
  html += '<p><strong>Address:</strong> ' + fullAddress + '</p>';
  html += '<p><strong>Shipping Method:</strong> ' + shippingMethod + '</p>';
  html += '<p><strong>Payment Method:</strong> ' + orderData.paymentMethod + '</p>';
  
  shippingBox.innerHTML = html;
}

// ============================================
// INITIALIZE: Load order when page loads
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadOrderConfirmation);
} else {
  loadOrderConfirmation();
}
