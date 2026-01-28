// API-based Cart functionality
// This is an API version of script.js

// include footer
fetch('/component/footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  });

// Dropdown Menu
// Credit : https://codepen.io/AleksDev-/pen/PwZaZZb
$('.dropdown').click(function () {
  $(this).attr('tabindex', 1).focus();
  $(this).toggleClass('active');
  $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
  $(this).removeClass('active');
  $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
  $(this).parents('.dropdown').find('span').text($(this).text());
  $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});

// API-based Cart functionality
async function getCart() {
  try {
    // Fetch cart from API
    const response = await apiRequest(API_CONFIG.endpoints.getCart, 'GET');
    return response.cart || [];
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    // Fallback to localStorage if API fails
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
}

async function saveCart(cart) {
  try {
    // Save cart to API
    await apiRequest(API_CONFIG.endpoints.cart, 'PUT', { cart: cart });
    // Also save to localStorage as backup
    localStorage.setItem('cart', JSON.stringify(cart));
    await updateCartCount();
  } catch (error) {
    console.error('Failed to save cart:', error);
    // Fallback to localStorage only
    localStorage.setItem('cart', JSON.stringify(cart));
    await updateCartCount();
  }
}

async function updateCartCount() {
  const cart = await getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartLinks = document.querySelectorAll('a[href="cart.html"]');
  cartLinks.forEach(link => {
    link.textContent = `Cart(${totalItems})`;
  });
}

async function addToCart(productName, price, image, size, color) {
  // Validate size and color selection
  if (!size || size === 'Size') {
    alert('Please select a size');
    return;
  }
  if (!color || color === 'Color') {
    alert('Please select a color');
    return;
  }

  try {
    // Send add to cart request to API
    const response = await apiRequest(API_CONFIG.endpoints.addToCart, 'POST', {
      productName: productName,
      price: parseFloat(price),
      image: image,
      size: size.toLowerCase(),
      color: color.toLowerCase(),
      quantity: 1
    });

    if (response.success) {
      alert(`${productName} added to cart!`);
      await updateCartCount();
    }
  } catch (error) {
    console.error('Failed to add to cart via API:', error);
    
    // Fallback to localStorage method
    const cart = await getCart();
    
    const existingItemIndex = cart.findIndex(item => 
      item.name === productName && 
      item.size === size.toLowerCase() && 
      item.color === color.toLowerCase()
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        name: productName,
        price: parseFloat(price),
        image: image,
        size: size.toLowerCase(),
        color: color.toLowerCase(),
        quantity: 1
      });
    }

    await saveCart(cart);
    alert(`${productName} added to cart!`);
  }
}

// Update cart count on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
  updateCartCount();
}
