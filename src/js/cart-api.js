// API-based Cart page functionality
// This is an API version of cart.js

// Load and display cart items from API
async function loadCart() {
  const cart = await getCart();
  const cartContainer = document.querySelector('.cart-item');
  
  if (!cartContainer) return;
  
  // Clear existing items
  const cartHeader = document.querySelector('.cart-header');
  let nextElement = cartHeader.nextElementSibling;
  while (nextElement && nextElement.classList.contains('cart-item')) {
    const toRemove = nextElement;
    nextElement = nextElement.nextElementSibling;
    toRemove.remove();
  }
  
  if (cart.length === 0) {
    cartHeader.insertAdjacentHTML('afterend', `
      <div class="cart-item max-width" style="text-align: center; padding: 40px;">
        <p>Your cart is empty. <a href="product.html">Continue shopping</a></p>
      </div>
    `);
    updateCartSummary();
    return;
  }
  
  // Add each cart item
  cart.forEach((item, index) => {
    const itemHTML = `
      <div class="cart-item max-width" data-index="${index}">
        <div class="col item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <p class="desc">${item.name}</p>
            <p class="desc-detail">• size ${item.size}<br>• ${item.color}</p>
          </div>
        </div>
        <div class="col price">
          <p>${item.price}</p>
        </div>
        <div class="col quantity">
          <button class="option decrease-qty" data-index="${index}">−</button>
          <input class="option quantity-input" value="${item.quantity}" data-index="${index}" readonly>
          <button class="option increase-qty" data-index="${index}">+</button>
        </div>
        <div class="col total">
          <p>${(item.price * item.quantity).toFixed(0)}</p>
        </div>
      </div>
    `;
    cartHeader.insertAdjacentHTML('afterend', itemHTML);
  });
  
  attachQuantityListeners();
  updateCartSummary();
}

function attachQuantityListeners() {
  document.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      updateQuantity(index, 1);
    });
  });
  
  document.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      updateQuantity(index, -1);
    });
  });
}

async function updateQuantity(index, change) {
  const cart = await getCart();
  
  if (cart[index]) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
      // Remove item via API
      try {
        await apiRequest(API_CONFIG.endpoints.removeFromCart, 'DELETE', {
          index: index
        });
      } catch (error) {
        console.error('Failed to remove item via API:', error);
      }
      cart.splice(index, 1);
    } else {
      // Update quantity via API
      try {
        await apiRequest(API_CONFIG.endpoints.updateCart, 'PATCH', {
          index: index,
          quantity: cart[index].quantity
        });
      } catch (error) {
        console.error('Failed to update quantity via API:', error);
      }
    }
    
    await saveCart(cart);
    await loadCart();
  }
}

async function updateCartSummary() {
  const cart = await getCart();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0;
  const taxRate = 0.25;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shipping + tax;
  
  const subtotalElement = document.querySelector('.subtotal h1:last-child');
  const shippingElement = document.querySelector('.shipping p:last-child');
  const taxElement = document.querySelector('.tax p:last-child');
  const totalElement = document.querySelector('.total h1:last-child');
  
  if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(0);
  if (shippingElement) shippingElement.textContent = shipping.toFixed(0);
  if (taxElement) taxElement.textContent = tax.toFixed(0);
  if (totalElement) totalElement.textContent = total.toFixed(0);
}

// Initialize cart on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCart);
} else {
  loadCart();
}
