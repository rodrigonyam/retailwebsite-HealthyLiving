// Product Page Functionality
let currentProduct = null;
let currentQuantity = 1;

// Initialize product page when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeProductPage();
    setupTabFunctionality();
    setupQuantityControls();
});

function initializeProductPage() {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        loadProductDetails(productId);
    } else {
        // Redirect to home if no product ID
        window.location.href = 'index.html';
    }
}

function loadProductDetails(productId) {
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${currentProduct.name} - HealthyLiving`;
    document.getElementById('product-title').textContent = `${currentProduct.name} - HealthyLiving`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-product').textContent = currentProduct.name;
    
    // Update product image and info
    updateProductImage();
    updateProductInfo();
    updateProductTabs();
    loadRelatedProducts();
    
    // Check if product is in wishlist
    updateWishlistButton();
    
    // Update cart count
    updateCartCount();
}

function updateProductImage() {
    const iconElement = document.getElementById('product-main-icon');
    const availabilityBadge = document.getElementById('product-availability-badge');
    const availabilityText = document.getElementById('product-availability-text');
    
    iconElement.className = `fas ${currentProduct.icon} product-icon`;
    
    // Update availability badge
    const availabilityClass = getAvailabilityClass(currentProduct.availability);
    const availabilityTextContent = getAvailabilityText(currentProduct.availability, currentProduct.stockCount);
    
    availabilityBadge.className = `availability-badge ${availabilityClass}`;
    availabilityText.textContent = availabilityTextContent;
}

function updateProductInfo() {
    // Update basic info
    document.getElementById('product-category-badge').textContent = getCategoryName(currentProduct.category);
    document.getElementById('product-name').textContent = currentProduct.name;
    document.getElementById('product-code').textContent = `Item Code: ${currentProduct.itemCode}`;
    
    // Update rating
    document.getElementById('product-stars').innerHTML = generateStars(currentProduct.rating);
    document.getElementById('product-rating-text').textContent = `${currentProduct.rating} (${currentProduct.reviewCount} reviews)`;
    
    // Update pricing
    document.getElementById('product-price').textContent = `$${currentProduct.price}`;
    document.getElementById('product-wholesale-price').textContent = `$${currentProduct.wholesalePrice}`;
    
    // Update description
    document.getElementById('product-description').textContent = currentProduct.description;
    
    // Update add to cart button based on availability
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const canAddToCart = currentProduct.availability === 'in-stock' || currentProduct.availability === 'low-stock';
    
    if (!canAddToCart) {
        addToCartBtn.disabled = true;
        if (currentProduct.availability === 'out-of-stock') {
            addToCartBtn.textContent = 'Out of Stock';
        } else if (currentProduct.availability === 'discontinued') {
            addToCartBtn.textContent = 'Discontinued';
        } else if (currentProduct.availability === 'pre-order') {
            addToCartBtn.textContent = 'Pre-Order';
        }
    }
}

function updateProductTabs() {
    // Update detailed description
    if (currentProduct.detailedDescription) {
        document.getElementById('detailed-description').innerHTML = `<p>${currentProduct.detailedDescription}</p>`;
    }
    
    // Update benefits
    if (currentProduct.benefits) {
        const benefitsList = document.getElementById('benefits-list');
        benefitsList.innerHTML = currentProduct.benefits.map(benefit => `<li>${benefit}</li>`).join('');
    }
    
    // Update specifications
    if (currentProduct.specifications) {
        const specsGrid = document.getElementById('specs-grid');
        specsGrid.innerHTML = Object.entries(currentProduct.specifications).map(([key, value]) => `
            <div class="spec-item">
                <div class="spec-label">${key.replace(/_/g, ' ')}</div>
                <div class="spec-value">${value === true ? 'Yes' : value === false ? 'No' : value}</div>
            </div>
        `).join('');
    }
    
    // Update ingredients
    if (currentProduct.ingredients) {
        document.getElementById('ingredients-list').innerHTML = `
            <p>This product contains the following carefully selected ingredients:</p>
            <ul>${currentProduct.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
        `;
    }
    
    // Update usage instructions
    if (currentProduct.usage) {
        if (currentProduct.usage.frequency) {
            document.getElementById('usage-frequency').innerHTML = `
                <h4>Frequency:</h4>
                <p>${currentProduct.usage.frequency}</p>
            `;
        }
        
        if (currentProduct.usage.instructions) {
            document.getElementById('usage-steps').innerHTML = `
                <h4>Instructions:</h4>
                <p>${currentProduct.usage.instructions}</p>
            `;
        }
        
        if (currentProduct.usage.tips) {
            document.getElementById('tips-list').innerHTML = currentProduct.usage.tips.map(tip => `<li>${tip}</li>`).join('');
        }
    }
}

function setupTabFunctionality() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            button.classList.add('active');
            document.getElementById(`${targetTab}-panel`).classList.add('active');
        });
    });
}

function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    
    quantityInput.addEventListener('change', function() {
        currentQuantity = Math.max(1, parseInt(this.value) || 1);
        this.value = currentQuantity;
    });
}

function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    currentQuantity = Math.max(1, currentQuantity + change);
    quantityInput.value = currentQuantity;
}

function addToCartFromProduct() {
    if (!currentProduct) return;
    
    const canAddToCart = currentProduct.availability === 'in-stock' || currentProduct.availability === 'low-stock';
    if (!canAddToCart) {
        showNotification('This product is not available for purchase');
        return;
    }
    
    // Add to cart with specified quantity
    for (let i = 0; i < currentQuantity; i++) {
        addToCart(currentProduct.id);
    }
    
    showNotification(`${currentQuantity} x ${currentProduct.name} added to cart!`);
    
    // Reset quantity to 1
    currentQuantity = 1;
    document.getElementById('quantity').value = 1;
}

function toggleWishlistFromProduct() {
    if (!currentProduct) return;
    
    toggleWishlist(currentProduct.id);
    updateWishlistButton();
}

function updateWishlistButton() {
    const wishlistBtn = document.querySelector('.wishlist-btn-product');
    const wishlistIcon = document.getElementById('wishlist-icon');
    
    const isInWishlist = wishlist.some(item => item.id === currentProduct.id);
    
    if (isInWishlist) {
        wishlistBtn.classList.add('active');
        wishlistIcon.className = 'fas fa-heart';
    } else {
        wishlistBtn.classList.remove('active');
        wishlistIcon.className = 'far fa-heart';
    }
}

function loadRelatedProducts() {
    const relatedProductsGrid = document.getElementById('related-products-grid');
    
    // Get products from the same category, excluding current product
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4); // Show up to 4 related products
    
    if (relatedProducts.length === 0) {
        // If no products in same category, show random products
        relatedProducts.push(...products
            .filter(p => p.id !== currentProduct.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
        );
    }
    
    relatedProductsGrid.innerHTML = relatedProducts.map(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const isInComparison = comparison.some(item => item.id === product.id);
        const availabilityClass = getAvailabilityClass(product.availability);
        const availabilityText = getAvailabilityText(product.availability, product.stockCount);
        const canAddToCart = product.availability === 'in-stock' || product.availability === 'low-stock';
        
        return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <i class="fas ${product.icon}"></i>
                    <div class="availability-badge ${availabilityClass}">
                        ${availabilityText}
                    </div>
                    <div class="product-overlay">
                        <button class="product-action-btn quick-view-btn" onclick="viewProduct(${product.id})" title="View Product">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="product-action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="product-action-btn compare-btn ${isInComparison ? 'active' : ''}" onclick="toggleCompare(${product.id})" title="Compare">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${getCategoryName(product.category)}</span>
                    <h3 onclick="viewProduct(${product.id})" style="cursor: pointer;">${product.name}</h3>
                    <div class="product-code">Item Code: ${product.itemCode}</div>
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(product.rating || 4.5)}
                        </div>
                        <span class="rating-count">(${product.reviewCount || Math.floor(Math.random() * 200) + 50})</span>
                    </div>
                    <p>${product.description}</p>
                    <div class="availability-info ${availabilityClass}">
                        <i class="fas ${getAvailabilityIcon(product.availability)}"></i>
                        <span>${availabilityText}</span>
                        ${product.stockCount > 0 && product.availability !== 'discontinued' ? `<span class="stock-count">(${product.stockCount} available)</span>` : ''}
                    </div>
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="current-price">$${product.price}</span>
                            <span class="original-price">$${product.wholesalePrice}</span>
                        </div>
                        <button class="add-to-cart ${!canAddToCart ? 'disabled' : ''}" 
                                onclick="addToCart(${product.id})" 
                                ${!canAddToCart ? 'disabled' : ''}>
                            ${canAddToCart ? 'Add to Cart' : 
                              product.availability === 'out-of-stock' ? 'Out of Stock' :
                              product.availability === 'discontinued' ? 'Discontinued' :
                              product.availability === 'pre-order' ? 'Pre-Order' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Function to navigate to a product page
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}