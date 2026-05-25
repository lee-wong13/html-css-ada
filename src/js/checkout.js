// ============================================
// CHECKOUT PAGE - SIMPLE VERSION
// Display cart items and calculate totals
// ============================================

// FUNCTION: Load Cart Items in Checkout
function loadCheckoutCart() {
  // Get cart from localStorage
  const cart = getCart();
  
  // Get the container where items will be displayed
  const container = document.querySelector('.col-right');
  if (!container) {
    return;
  }
  
  // Find the items section (before subtotal)
  const subtotalLine = container.querySelector('.line');
  if (!subtotalLine) {
    return;
  }
  
  // Check if cart is empty
  if (cart.length === 0) {
    // Insert empty message before subtotal
    let emptyHTML = '<div class="item" style="text-align: center; padding: 20px;">';
    emptyHTML += '<p style="color: #999;">Your cart is empty</p>';
    emptyHTML += '<a href="product.html" style="color: #007bff;">Continue Shopping</a>';
    emptyHTML += '</div>';
    subtotalLine.insertAdjacentHTML('beforebegin', emptyHTML);
    
    // Set all amounts to 0
    updateCheckoutSummary(0, 0);
    return;
  }
  
  // Clear any existing items (between title and subtotal)
  const existingItems = container.querySelectorAll('.item');
  for (let i = 0; i < existingItems.length; i++) {
    existingItems[i].remove();
  }
  
  // Add each cart item
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    
    // Validate item data
    if (!item.name || !item.price || !item.quantity) {
      continue; // Skip invalid items
    }
    
    const itemHTML = createCheckoutItemHTML(item);
    subtotalLine.insertAdjacentHTML('beforebegin', itemHTML);
  }
  
  // Calculate subtotal
  const subtotal = calculateSubtotal(cart);
  
  // Get selected shipping price (default to standard shipping)
  const shippingPrice = getSelectedShippingPrice();
  
  // Update the summary section
  updateCheckoutSummary(subtotal, shippingPrice);
}

// FUNCTION: Create HTML for Single Checkout Item
function createCheckoutItemHTML(item) {
  const name = item.name || 'Unknown Product';
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 1;
  const size = item.size || 'N/A';
  const color = item.color || 'N/A';
  const image = item.image || 'assets/images/RainyDays_Jacket1.jpg';
  
  // Calculate item total
  const itemTotal = price * quantity;
  
  let html = '';
  html += '<div class="item">';
  html += '<div class="thumb"><img src="' + image + '" alt="' + name + '"></div>';
  html += '<div class="sub-item">';
  html += '<div class="detail-item">';
  html += '<div>';
  html += '<h3 class="name">' + name + '</h3>';
  html += '<p class="muted">size ' + size + ', ' + color + '</p>';
  html += '</div>';
  html += '<p class="muted">' + quantity + ' piece' + (quantity > 1 ? 's' : '') + '</p>';
  html += '</div>';
  html += '<h3 class="price">' + itemTotal.toFixed(2) + '</h3>';
  html += '</div>';
  html += '</div>';
  
  return html;
}

// FUNCTION: Calculate Subtotal from Cart
function calculateSubtotal(cart) {
  let subtotal = 0;
  
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    subtotal += price * quantity;
  }
  
  return subtotal;
}

// FUNCTION: Get Selected Shipping Price
function getSelectedShippingPrice() {
  // Find the selected shipping radio button
  const selectedShipping = document.querySelector('input[name="ship"]:checked');
  
  if (!selectedShipping) {
    return 69; // Default to standard shipping
  }
  
  // Get the price element next to the radio button
  const priceElement = selectedShipping.closest('.option').querySelector('.price');
  
  if (priceElement) {
    return Number(priceElement.textContent) || 0;
  }
  
  return 69; // Default fallback
}

// FUNCTION: Update Checkout Summary (Subtotal, Shipping, Total)
function updateCheckoutSummary(subtotal, shippingPrice) {
  // Update subtotal
  const subtotalElement = document.querySelector('.line h3:last-child');
  if (subtotalElement) {
    subtotalElement.textContent = subtotal.toFixed(2);
  }
  
  // Update shipping price
  const shippingPriceElement = document.querySelector('.line.ship h3:last-child');
  if (shippingPriceElement) {
    shippingPriceElement.textContent = shippingPrice.toFixed(2);
  }
  
  // Update shipping description
  const selectedShipping = document.querySelector('input[name="ship"]:checked');
  if (selectedShipping) {
    const shippingLabel = selectedShipping.closest('.option').querySelector('strong');
    const shippingDesc = selectedShipping.closest('.option').querySelector('small');
    
    if (shippingLabel && shippingDesc) {
      const shippingTextElement = document.querySelector('.line.ship p');
      if (shippingTextElement) {
        shippingTextElement.textContent = shippingLabel.textContent + ', ' + shippingDesc.textContent;
      }
    }
  }
  
  // Calculate and update total (subtotal + shipping)
  const total = subtotal + shippingPrice;
  const totalElement = document.querySelector('.line.total h2:last-child');
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }
}

// FUNCTION: Handle Shipping Method Change
function attachShippingListeners() {
  const shippingRadios = document.querySelectorAll('input[name="ship"]');
  
  for (let i = 0; i < shippingRadios.length; i++) {
    shippingRadios[i].addEventListener('change', function() {
      // Recalculate total with new shipping price
      const cart = getCart();
      const subtotal = calculateSubtotal(cart);
      const shippingPrice = getSelectedShippingPrice();
      updateCheckoutSummary(subtotal, shippingPrice);
    });
  }
}

// FUNCTION: Validate and Handle Checkout
function handleCheckout() {
  // Check if Terms & Conditions is checked
  const termsCheckbox = document.getElementById('terms-checkbox');
  
  if (!termsCheckbox) {
    alert('❌ Error: Terms & Conditions checkbox not found');
    return;
  }
  
  if (!termsCheckbox.checked) {
    alert('⚠️ Please accept the Terms & Conditions before proceeding');
    return;
  }
  
  // Check if cart is empty
  const cart = getCart();
  if (cart.length === 0) {
    alert('⚠️ Your cart is empty. Please add items before checkout');
    return;
  }
  
  // Collect form data
  const orderData = {
    email: document.querySelector('input[name="email"]').value || 'Not provided',
    firstName: document.querySelector('input[name="firstname"]').value || 'Not provided',
    lastName: document.querySelector('input[name="lastname"]').value || 'Not provided',
    address: document.querySelector('input[name="address"]').value || 'Not provided',
    apt: document.querySelector('input[placeholder*="Apartment"]').value || '',
    postalCode: document.querySelector('input[name="post"]').value || 'Not provided',
    city: document.querySelector('input[name="city"]').value || 'Not provided',
    province: document.querySelector('input[name="province"]').value || 'Not provided',
    country: document.querySelector('input[name="country"]').value || 'Not provided',
    shippingMethod: getShippingMethodDetails(),
    paymentMethod: getPaymentMethodDetails(),
    cart: cart,
    subtotal: calculateSubtotal(cart),
    shippingCost: getSelectedShippingPrice(),
    total: calculateSubtotal(cart) + getSelectedShippingPrice(),
    orderNumber: generateOrderNumber(),
    orderDate: new Date().toLocaleString()
  };
  
  // Save order data to localStorage
  localStorage.setItem('lastOrder', JSON.stringify(orderData));
  
  // Clear cart after successful order
  localStorage.removeItem('cart');
  
  // All validation passed, proceed to success page
  location.href = 'success.html';
}

// FUNCTION: Get Shipping Method Details
function getShippingMethodDetails() {
  const selectedShipping = document.querySelector('input[name="ship"]:checked');
  if (!selectedShipping) {
    return 'Standard Shipping';
  }
  
  const shippingLabel = selectedShipping.closest('.option').querySelector('strong');
  const shippingDesc = selectedShipping.closest('.option').querySelector('small');
  
  return {
    name: shippingLabel ? shippingLabel.textContent : 'Standard Shipping',
    description: shippingDesc ? shippingDesc.textContent : '4–7 Business Days'
  };
}

// FUNCTION: Get Payment Method Details
function getPaymentMethodDetails() {
  const selectedPayment = document.querySelector('input[name="pay"]:checked');
  if (!selectedPayment) {
    return 'Debit or Credit Card';
  }
  
  const paymentLabel = selectedPayment.closest('.option').querySelector('strong');
  return paymentLabel ? paymentLabel.textContent : 'Debit or Credit Card';
}

// FUNCTION: Generate Random Order Number
function generateOrderNumber() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// FUNCTION: Attach Checkout Button Listener
function attachCheckoutListener() {
  const checkoutBtn = document.getElementById('checkout-btn');
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }
}

// ============================================
// INITIALIZE: Load cart when page loads
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutCart();
    attachShippingListeners();
    attachCheckoutListener();
  });
} else {
  loadCheckoutCart();
  attachShippingListeners();
  attachCheckoutListener();
}
