document.addEventListener("DOMContentLoaded", () => {
    console.log("¡JavaScript cargado correctamente!");
});

const API_URL = "https://fakestoreapi.com/products";
let cart = [];

// Función para obtener productos desde la API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        console.log("Productos obtenidos:", products);
        displayProducts(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", fetchProducts);

// Función para mostrar productos
function displayProducts(products) {
    const productsGrid = document.querySelector(".products-grid");
    productsGrid.innerHTML = ""; // Limpiar contenido previo

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">Añadir al Carrito</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Evento para añadir productos al carrito
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = event.target.dataset.id;
        const productTitle = event.target.dataset.title;
        const productPrice = parseFloat(event.target.dataset.price);
        addToCart(productId, productTitle, productPrice);
        showNotification("Producto añadido al carrito");
    }

    // Simular la compra con tarjeta
    if (event.target.classList.contains("pay-with-card")) {
        processPayment("Tarjeta de crédito");
    }

    // Simular la compra con PayPal
    if (event.target.classList.contains("pay-with-paypal")) {
        processPayment("PayPal");
    }

    // Finalizar compra
    if (event.target.classList.contains("finalizar-compra")) {
        finalizarCompra();
    }
});

// Función para añadir productos al carrito
function addToCart(productId, productTitle, productPrice) {
    const productExists = cart.find(product => product.id == productId);
    if (productExists) {
        productExists.quantity++;
    } else {
        const product = { id: productId, title: productTitle, price: productPrice, quantity: 1 };
        cart.push(product);
    }
    console.log("Carrito actualizado:", cart);
    saveCart();
    renderCart();
}

// Función para renderizar el carrito
function renderCart() {
    const cartContainer = document.querySelector(".cart-container");
    cartContainer.innerHTML = ""; // Limpiar contenido previo

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Tu carrito está vacío</p>";
        const paymentMethodsContainer = document.querySelector(".payment-methods");
        paymentMethodsContainer.innerHTML = ""; // Limpiar opciones de pago
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <h4>${item.title}</h4>
            <p>Cantidad: <span>${item.quantity}</span></p>
            <p>Precio: $${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
        `;
        cartContainer.appendChild(cartItem);
        totalPrice += item.price * item.quantity;
    });

    const totalElement = document.createElement("div");
    totalElement.className = "cart-total";
    totalElement.innerHTML = `<p>Total: $${totalPrice.toFixed(2)}</p>`;
    cartContainer.appendChild(totalElement);

    // Mostrar métodos de pago
    renderPaymentMethods(totalPrice);
}

// Función para eliminar productos del carrito
function removeFromCart(productId) {
    cart = cart.filter(product => product.id != productId);
    console.log("Producto eliminado:", productId);
    saveCart();
    renderCart();
}

// Función para mostrar opciones de pago
function renderPaymentMethods(totalPrice) {
    const paymentMethodsContainer = document.querySelector(".payment-methods");
    paymentMethodsContainer.innerHTML = `
        <h3>Opciones de pago</h3>
        <p>Total a pagar: $${totalPrice.toFixed(2)}</p>
        <button class="pay-with-card">Pagar con tarjeta Credito</button>
         <button class="pay-with-card">Pagar con tarjeta Debito</button>
        <button class="pay-with-mercado pago">Pagar con Mercado Pago</button>
         <button class="pay-with-tranferencia">Pagar con Transferencia</button>
        <button class="finalizar-compra">Finalizar compra</button>
    `;
}

// Botón para vaciar el carrito
document.getElementById("vaciar-carrito").addEventListener("click", () => {
    cart = [];
    renderCart();
    console.log("Carrito vaciado");
});

// Función para guardar el carrito en LocalStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para cargar el carrito desde LocalStorage
function loadCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        renderCart();
    }
}

// Llamar a loadCart cuando la página cargue
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

// Función para mostrar notificación al usuario
function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification show";
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove("show");
        notification.addEventListener("transitionend", () => notification.remove());
    }, 3000);
}

// Función para simular el proceso de pago
function processPayment(method) {
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    showNotification(`Pago realizado con ${method}. Total: $${totalPrice.toFixed(2)}`);
    clearCart();
}

// Función para finalizar la compra
function finalizarCompra() {
    if (cart.length === 0) {
        showNotification("No tienes productos en tu carrito.");
        return;
    }

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    showNotification(`Compra finalizada. Total a pagar: $${totalPrice.toFixed(2)}`);
    clearCart();
}

// Función para vaciar el carrito después de una compra
function clearCart() {
    cart = [];
    saveCart();
    renderCart();

    // Limpiar las opciones de pago
    const paymentMethodsContainer = document.querySelector(".payment-methods");
    paymentMethodsContainer.innerHTML = "";
}

// Función para obtener el precio de un producto por su ID
function getProductPriceById(productId) {
    const product = cart.find(item => item.id == productId);
    return product ? product.price : 0;  // Devuelve 0 si no se encuentra el producto
}
// Función para renderizar el carrito
function renderCart() {
    const cartContainer = document.querySelector(".cart-container");
    cartContainer.innerHTML = ""; // Limpiar contenido previo

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Tu carrito está vacío</p>";
        const paymentMethodsContainer = document.querySelector(".payment-methods");
        paymentMethodsContainer.innerHTML = ""; // Limpiar opciones de pago
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <h4>${item.title}</h4>
            <p>Cantidad: <span>${item.quantity}</span></p>
            <p>Precio: $${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
        `;
        cartContainer.appendChild(cartItem);
        totalPrice += item.price * item.quantity;
    });

    const totalElement = document.createElement("div");
    totalElement.className = "cart-total";
    totalElement.innerHTML = `<p>Total: $${totalPrice.toFixed(2)}</p>`;
    cartContainer.appendChild(totalElement);

    // Mostrar métodos de pago
    renderPaymentMethods(totalPrice);
}

// Evento para eliminar un producto del carrito
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
        const productId = event.target.dataset.id;
        removeFromCart(productId);
    }

    // Otros eventos de pago o finalización...
});

// Función para eliminar productos del carrito
function removeFromCart(productId) {
    // Filtrar el producto a eliminar por su ID
    cart = cart.filter(product => product.id != productId);
    console.log("Producto eliminado:", productId);

    // Guardar el carrito actualizado en LocalStorage
    saveCart();

    // Volver a renderizar el carrito
    renderCart();
}
