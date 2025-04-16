let allCarts = [];
let cartDetails = {};
let totalItemsInCart = 0;
let totalPriceInCart = 0;

async function fetchCarts() {
  try {
    const res = await fetch("https://dummyjson.com/carts");
    const data = await res.json();
    allCarts = data.carts.flatMap((cart) => cart.products);
    renderCarts();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderCarts(products = allCarts) {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  if (products.length === 0) {
    // Display "No items found" message if no products are available
    cartContainer.innerHTML = "<p>No items found.</p>";
    return;
  }

  products.forEach((product) => {
    const cartElement = document.createElement("div");
    cartElement.classList.add("cart");

    const isOutOfStock = product.quantity === 0;

    cartElement.innerHTML = `
<img src="${
  product.thumbnail || "https://via.placeholder.com/150"
}" alt="${product.title}" />
<h3>${product.title}</h3>
<p>Price: ₹${product.price}</p>
<p>Available Quantity: ${product.quantity}</p>
<button ${
  isOutOfStock ? "disabled" : ""
} onclick='addToCart(${JSON.stringify(product)})'>
  ${isOutOfStock ? "Out of Stock" : "Add to Cart"}
</button>
`;
    cartContainer.appendChild(cartElement);
  });
}

function filterByPrice() {
  const selectedPriceRange =
    document.getElementById("price-filter").value;
  let filteredCarts = [...allCarts];

  if (selectedPriceRange === "100-200") {
    filteredCarts = filteredCarts.filter(
      (product) => product.price >= 100 && product.price <= 200
    );
  } else if (selectedPriceRange === "less-than-5000") {
    filteredCarts = filteredCarts.filter(
      (product) => product.price < 5000
    );
  } else if (selectedPriceRange === "6000-50000") {
    filteredCarts = filteredCarts.filter(
      (product) => product.price >= 6000 && product.price <= 50000
    );
  } else if (selectedPriceRange === "greater-than-500000") {
    filteredCarts = filteredCarts.filter(
      (product) => product.price > 500000
    );
  }

  renderCarts(filteredCarts);
}

function addToCart(product) {
  const { title, price } = product;
  const indexInAllCarts = allCarts.findIndex(
    (item) => item.title === title
  );

  if (indexInAllCarts !== -1 && allCarts[indexInAllCarts].quantity > 0) {
    if (!cartDetails[title]) {
      cartDetails[title] = { ...product, quantity: 1 };
    } else {
      cartDetails[title].quantity += 1;
    }
    allCarts[indexInAllCarts].quantity -= 1;

    totalItemsInCart += 1;
    totalPriceInCart += price;

    updateCartUI();
    renderCarts(); // Re-render the cart to reflect updated quantities
  } else {
    alert("Item is out of stock!");
  }
}

function removeItemFromCart(title) {
  if (cartDetails[title]) {
    const product = cartDetails[title];
    const indexInAllCarts = allCarts.findIndex(
      (item) => item.title === title
    );

    if (product.quantity > 1) {
      product.quantity -= 1;
      totalItemsInCart -= 1;
      totalPriceInCart -= product.price;
    } else {
      totalItemsInCart -= product.quantity;
      totalPriceInCart -= product.price * product.quantity;
      delete cartDetails[title];
    }

    if (indexInAllCarts !== -1) {
      allCarts[indexInAllCarts].quantity += 1;
    }

    updateCartUI();
    renderCartModal(); // Update the cart modal contents
    renderCarts(); // Re-render the main product list to update quantities
  }
}

function renderCartModal() {
  const cartItemsList = document.getElementById("cart-items-list");
  const cartTotal = document.getElementById("cart-total");

  cartItemsList.innerHTML = "";

  if (totalItemsInCart === 0) {
    cartItemsList.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerHTML = `
<h4>Total Items: 0</h4>
<h4>Total Price: ₹0</h4>
`;
  } else {
    Object.values(cartDetails).forEach((product) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      itemElement.innerHTML = `
  <img src="${
    product.thumbnail || "https://via.placeholder.com/50"
  }" alt="${product.title}" />
  <div class="cart-item-details">
    <p>${product.title}</p>
    <p>Quantity: ${product.quantity}</p>
    <p>Price: ₹${product.price * product.quantity}</p>
    <button onclick='removeItemFromCart("${
      product.title
    }")'>Remove one</button>
  </div>
`;
      cartItemsList.appendChild(itemElement);
    });

    cartTotal.innerHTML = `
<h4>Total Items: ${totalItemsInCart}</h4>
<h4>Total Price: ₹${totalPriceInCart}</h4>
`;
  }
}

function updateCartUI() {
  const cartBadge = document.getElementById("cart-badge");
  if (totalItemsInCart > 0) {
    cartBadge.style.display = "flex"; // Show the badge
    cartBadge.textContent = totalItemsInCart;
  } else {
    cartBadge.style.display = "none"; // Hide the badge
  }
}

function toggleCartModal() {
  const modal = document.getElementById("cart-modal");
  const cartItemsList = document.getElementById("cart-items-list");
  const cartTotal = document.getElementById("cart-total");

  modal.style.display =
    modal.style.display === "block" ? "none" : "block";

  cartItemsList.innerHTML = "";

  if (totalItemsInCart === 0) {
    // Display an empty cart message
    cartItemsList.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerHTML = `
<h4>Total Items: 0</h4>
<h4>Total Price: ₹0</h4>
`;
  } else {
    // Populate the cart with items
    Object.values(cartDetails).forEach((product) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      itemElement.innerHTML = `
  <img src="${
    product.thumbnail || "https://via.placeholder.com/50"
  }" alt="${product.title}" />
  <div class="cart-item-details">
    <p>${product.title}</p>
    <p>Quantity: ${product.quantity}</p>
    <p>Price: ₹${product.price * product.quantity}</p>
    <button onclick='removeItemFromCart("${
      product.title
    }")'>Remove one item</button>
  </div>
`;
      cartItemsList.appendChild(itemElement);
    });

    // Update total items and price
    cartTotal.innerHTML = `
<h4>Total Items: ${totalItemsInCart}</h4>
<h4>Total Price: ₹${totalPriceInCart}</h4>
`;
  }
}

function filterCarts() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredCarts = allCarts.filter((product) =>
    product.title.toLowerCase().includes(searchInput)
  );
  renderCarts(filteredCarts);
}

fetchCarts();