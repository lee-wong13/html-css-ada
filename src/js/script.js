// ============================================
// DROPDOWN MENU (for selecting size and color)
// ============================================
// Credit : https://codepen.io/AleksDev-/pen/PwZaZZb
$(".dropdown").click(function () {
  $(this).attr("tabindex", 1).focus();
  $(this).toggleClass("active");
  $(this).find(".dropdown-menu").slideToggle(300);
});
$(".dropdown").focusout(function () {
  $(this).removeClass("active");
  $(this).find(".dropdown-menu").slideUp(300);
});
$(".dropdown .dropdown-menu li").click(function () {
  $(this).parents(".dropdown").find("span").text($(this).text());
  $(this).parents(".dropdown").find("input").attr("value", $(this).attr("id"));
});

// ============================================
// SHOPPING CART FUNCTIONS - SIMPLE VERSION
// ============================================

// FUNCTION 1: Get Cart from Browser Storage
// This reads the cart data from the browser's memory (localStorage)
function getCart() {
  // Get the cart string from localStorage
  var cartString = localStorage.getItem("cart");

  // If cart exists, convert it from text to JavaScript array
  // If not, return an empty array
  if (cartString) {
    return JSON.parse(cartString); // Convert text to array
  } else {
    return []; // Empty cart
  }
}

// FUNCTION 2: Save Cart to Browser Storage
// This saves the cart array to browser's memory
function saveCart(cart) {
  // Convert cart array to text and save it
  var cartText = JSON.stringify(cart);
  localStorage.setItem("cart", cartText);

  // Update the cart count in the header
  updateCartCount();
}

// FUNCTION 3: Update Cart Count in Header
// This updates the "Cart(3)" number you see in the navigation
function updateCartCount() {
  // Get current cart
  var cart = getCart();

  // Count total items (add up all quantities)
  var totalItems = 0;
  for (var i = 0; i < cart.length; i++) {
    totalItems = totalItems + cart[i].quantity;
  }

  // Find all cart links in the page
  var cartLinks = document.querySelectorAll('a[href="cart.html"]');

  // Update each cart link text to show the count
  for (let i = 0; i < cartLinks.length; i++) {
    // If cart is empty, show just "Cart"
    // If cart has items, show "Cart(3)" with the number
    if (totalItems === 0) {
      cartLinks[i].textContent = "Cart";
    } else {
      cartLinks[i].textContent = "Cart(" + totalItems + ")";
    }
  }
}

// FUNCTION 4: Add Product to Cart
// This is the main function that adds items to the cart
// It needs: product name, price, image, size, and color
function addToCart(productName, price, image, size, color) {
  // STEP 1: Check if user selected a size
  if (!size || size === "Size") {
    alert("Please select a size");
    return; // Stop here if no size selected
  }

  // STEP 2: Check if user selected a color
  if (!color || color === "Color") {
    alert("Please select a color");
    return; // Stop here if no color selected
  }

  // STEP 3: Get the current cart
  var cart = getCart();

  // STEP 4: Check if this exact item is already in cart
  // (same name, size, and color)
  var foundItem = false;
  var foundIndex = -1;

  for (var i = 0; i < cart.length; i++) {
    if (
      cart[i].name === productName &&
      cart[i].size === size.toLowerCase() &&
      cart[i].color === color.toLowerCase()
    ) {
      foundItem = true;
      foundIndex = i;
      break; // Stop searching
    }
  }

  // STEP 5: If item exists, just increase the quantity
  if (foundItem) {
    cart[foundIndex].quantity = cart[foundIndex].quantity + 1;
  }
  // STEP 6: If item doesn't exist, add it as new
  else {
    var newItem = {
      name: productName,
      price: Number(price),
      image: image,
      size: size.toLowerCase(),
      color: color.toLowerCase(),
      quantity: 1,
    };
    cart.push(newItem); // Add to cart array
  }

  // STEP 7: Save the updated cart
  saveCart(cart);

  // STEP 8: Show success message
  alert(productName + " added to cart!");
}

// ============================================
// INITIALIZE: Run when page loads
// ============================================
// This updates the cart count when you first load the page
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateCartCount);
} else {
  updateCartCount();
}
