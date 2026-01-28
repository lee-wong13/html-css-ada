# API Integration Guide for Cart System

## Overview
I've created API-enabled versions of your cart JavaScript files. Here's how to integrate them with a backend API.

## Files Created

### 1. `src/js/api-config.js`
Contains API configuration and helper functions for making HTTP requests.

### 2. `src/js/script-api.js`
API version of `script.js` with async cart operations.

### 3. `src/js/cart-api.js`
API version of `cart.js` with async cart operations.

---

## How to Use

### Option 1: Switch to API Version

Update your HTML files to use the API versions:

**In product pages** (midnight-reflective-urban-shell.html, etc.):
```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="src/js/api-config.js"></script>
<script src="src/js/script-api.js"></script>
```

**In cart.html**:
```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="src/js/api-config.js"></script>
<script src="src/js/script-api.js"></script>
<script src="src/js/cart-api.js"></script>
```

### Option 2: Keep Both (Recommended for Development)

Keep the current localStorage version as fallback and test the API version separately.

---

## Backend API Requirements

Your backend needs these endpoints:

### 1. **GET /api/cart**
Get cart items for current user
```json
Response: {
  "cart": [
    {
      "name": "Product Name",
      "price": 899,
      "image": "path/to/image.jpg",
      "size": "m",
      "color": "black",
      "quantity": 2
    }
  ]
}
```

### 2. **POST /api/cart/add**
Add item to cart
```json
Request: {
  "productName": "Product Name",
  "price": 899,
  "image": "path/to/image.jpg",
  "size": "m",
  "color": "black",
  "quantity": 1
}

Response: {
  "success": true,
  "message": "Item added to cart"
}
```

### 3. **PUT /api/cart**
Replace entire cart
```json
Request: {
  "cart": [...]
}

Response: {
  "success": true
}
```

### 4. **PATCH /api/cart/update**
Update quantity of an item
```json
Request: {
  "index": 0,
  "quantity": 3
}

Response: {
  "success": true
}
```

### 5. **DELETE /api/cart/remove**
Remove item from cart
```json
Request: {
  "index": 0
}

Response: {
  "success": true
}
```

---

## Example Backend (Node.js/Express)

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// In-memory cart storage (use database in production)
let carts = {};

// Get cart
app.get('/api/cart', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  res.json({ cart: carts[userId] || [] });
});

// Add to cart
app.post('/api/cart/add', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  if (!carts[userId]) carts[userId] = [];
  
  const { productName, price, image, size, color, quantity } = req.body;
  
  // Check if item exists
  const existingIndex = carts[userId].findIndex(item => 
    item.name === productName && 
    item.size === size && 
    item.color === color
  );
  
  if (existingIndex > -1) {
    carts[userId][existingIndex].quantity += quantity;
  } else {
    carts[userId].push({
      name: productName,
      price,
      image,
      size,
      color,
      quantity
    });
  }
  
  res.json({ success: true, message: 'Item added to cart' });
});

// Update cart
app.put('/api/cart', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  carts[userId] = req.body.cart;
  res.json({ success: true });
});

// Update quantity
app.patch('/api/cart/update', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  const { index, quantity } = req.body;
  
  if (carts[userId] && carts[userId][index]) {
    carts[userId][index].quantity = quantity;
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Item not found' });
  }
});

// Remove from cart
app.delete('/api/cart/remove', (req, res) => {
  const userId = req.headers['user-id'] || 'guest';
  const { index } = req.body;
  
  if (carts[userId]) {
    carts[userId].splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
```

---

## Configuration Steps

1. **Update API URL** in `src/js/api-config.js`:
   ```javascript
   baseURL: 'https://your-api-domain.com'
   ```

2. **Add Authentication** (if needed):
   ```javascript
   'Authorization': `Bearer ${localStorage.getItem('token')}`
   ```

3. **Test API endpoints** using tools like Postman or Thunder Client

4. **Add error handling** for better user experience

---

## Benefits of API Integration

✅ **Persistent cart** - Cart saved to database, accessible from any device
✅ **User accounts** - Track carts per user
✅ **Analytics** - Monitor cart abandonment, popular products
✅ **Security** - Validate prices server-side
✅ **Inventory** - Check stock availability in real-time
✅ **Multi-device sync** - Same cart across phone, tablet, desktop

---

## Testing

1. Start with localStorage version (current implementation)
2. Set up backend API
3. Switch to API version in one page first
4. Test thoroughly before deploying
5. API version has localStorage fallback for reliability

---

## Popular Backend Options

- **Node.js + Express** - JavaScript/TypeScript
- **WordPress REST API** - If using WordPress
- **Noroff API** - If available from your course
- **Firebase/Supabase** - Serverless backends
- **Custom PHP API** - Traditional approach

Would you like help implementing any specific backend?
