 // Sample Products Data
    const sampleProducts = [
        {
            name: "Wireless Headphones",
            description: "High-quality wireless headphones with noise cancellation.",
            price: 2500,
            image: "https://via.placeholder.com/150"
        },
        {
            name: "Smartphone",
            description: "Latest model smartphone with all the features you need.",
            price: 50000,
            image: "https://via.placeholder.com/150"
        },
        {
            name: "Gaming Laptop",
            description: "High-performance gaming laptop for enthusiasts.",
            price: 120000,
            image: "https://via.placeholder.com/150"
        }
    ];

    renderProducts(sampleProducts);


const productList = document.getElementById('product-list');
const cart = [];

function renderProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>Price:</strong> Ksh ${product.price}</p>
            <button class="btn buy-btn">Buy</button>
            <button class="btn add-to-cart-btn">Add to Cart</button>
        `;
        productList.appendChild(productCard);

        // Add event listener to 'Buy' button
        productCard.querySelector('.buy-btn').addEventListener('click', () => {
            showOrderPopup(product);
        });

        // Add event listener to 'Add to Cart' button
        productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            showAddToCartPopup(product);
        });
    });
}

function showOrderPopup(product) {
    const orderQuantity = prompt(`How many ${product.name} would you like to order?`);
    if (orderQuantity !== null && !isNaN(orderQuantity) && orderQuantity > 0) {
        processPayment(product, orderQuantity);
    } else {
        alert('Invalid quantity. Please enter a valid number.');
    }
}

function processPayment(product, quantity) {
    alert(`Successfully purchased ${quantity} ${product.name}(s) for Ksh ${product.price * quantity}.`);
}

function showAddToCartPopup(product) {
    const orderQuantity = prompt(`How many ${product.name} would you like to add to the cart?`);
    if (orderQuantity !== null && !isNaN(orderQuantity) && orderQuantity > 0) {
        addToCart(product, parseInt(orderQuantity));
    } else {
        alert('Invalid quantity. Please enter a valid number.');
    }
}

function addToCart(product, quantity) {
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        product.quantity = quantity;
        cart.push(product);
    }
    updateCartCount();
}

function updateCartCount() {
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartBtn.textContent = `Cart (${cartCount})`;
}

// Fetch and display comments when the page loads
getComments();

function getComments() {
    $.get("/comments", function (data) {
        if (!data) {
            console.log("No data received");
            return;
        }
        console.log("Data received");
        showComments(data);
    });
}

function showComments(comments) {
    var commentsSection = document.getElementById("suggestions");
    commentsSection.innerHTML = ""; // Clear previous comments
    for (var i = 0; i < comments.length; i++) {
        var section = document.createElement("section");
        section.className += "suggestion";

        var heading = document.createElement("h3");
        heading.innerHTML = comments[i].name;

        var commentText = document.createElement("p");
        commentText.innerHTML = comments[i].comment;

        section.appendChild(heading);
        section.appendChild(commentText);
        commentsSection.appendChild(section);
    }
}

// Handle form submission
$("#commentForm").submit(function (event) {
    event.preventDefault();
    const name = $("#name").val();
    const comment = $("#comment").val();

    $.post("/comments", { name, comment }, function (data) {
        if (data.error) {
            console.error(data.error);
            return;
        }
        // Clear the form
        $("#name").val("");
        $("#comment").val("");
        // Refresh comments
        getComments();
    });
});