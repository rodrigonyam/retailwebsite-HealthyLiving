// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let isMember = localStorage.getItem('isMember') === 'true';
let isChatActive = false;
let chatUserName = '';
let chatUserEmail = '';
let chatUserPhone = '';

// Function to navigate to individual product page
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    updateCartCount();
    setupEventListeners();
    updateUserInterface();
});

// Initialize products display
function initializeProducts() {
    displayProducts(currentFilter);
}

// Display products based on filter
function displayProducts(filter) {
    const productGrid = document.getElementById('productGrid');
    const products = window.productsData;
    
    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;
    
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const isInComparison = comparison.some(item => item.id === product.id);
    
    // Determine availability status and styling
    const availabilityClass = getAvailabilityClass(product.availability);
    const availabilityText = getAvailabilityText(product.availability, product.stockCount);
    const canAddToCart = product.availability === 'in-stock' || product.availability === 'low-stock';
    
    card.innerHTML = `
        <div class="product-image" onclick="viewProduct(${product.id})" style="cursor: pointer;">
            <i class="fas ${product.icon}"></i>
            <div class="availability-badge ${availabilityClass}">
                ${availabilityText}
            </div>
            <div class="product-overlay">
                <button class="product-action-btn quick-view-btn" onclick="event.stopPropagation(); openProductModal(${product.id})" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="product-action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="Add to Wishlist">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="product-action-btn compare-btn ${isInComparison ? 'active' : ''}" onclick="event.stopPropagation(); toggleCompare(${product.id})" title="Compare">
                    <i class="fas fa-balance-scale"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <span class="product-category">${getCategoryName(product.category)}</span>
            <h3 onclick="viewProduct(${product.id})" style="cursor: pointer; color: var(--primary-color); transition: color 0.3s ease;">${product.name}</h3>
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
                <div class="price-container">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    ${isMember ? `<div class="wholesale-price">Member: $${product.wholesalePrice.toFixed(2)}</div>` : ''}
                    ${isMember ? `<div class="savings">Save $${(product.price - product.wholesalePrice).toFixed(2)}</div>` : ''}
                </div>
                ${canAddToCart ? 
                    `<button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>` :
                    `<button class="add-to-cart disabled" disabled>
                        <i class="fas fa-ban"></i> ${product.availability === 'pre-order' ? 'Pre-Order' : 'Unavailable'}
                    </button>`
                }
            </div>
        </div>
    `;
    
    return card;
}

// Get category display name
function getCategoryName(category) {
    const names = {
        'beauty': 'Beauty',
        'vitamins': 'Vitamins',
        'personal': 'Personal Care',
        'home': 'Home Care'
    };
    return names[category] || category;
}

// Add product to cart
function addToCart(productId) {
    const product = window.productsData.find(p => p.id === productId);
    if (!product) return;
    
    const price = isMember ? product.wholesalePrice : product.price;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: price,
            icon: product.icon,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count badge
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Display cart items in modal
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Setup event listeners
function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            displayProducts(currentFilter);
        });
    });
    
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            document.querySelector(`[data-filter="${category}"]`).click();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            displayCartItems();
            cartModal.classList.add('active');
        });
    }
    
    // User button
    const userBtn = document.getElementById('userBtn');
    const authModal = document.getElementById('authModal');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // Dropdown menu items
    const profileLink = document.getElementById('profileLink');
    const accountLink = document.getElementById('accountLink');
    const signupDropLink = document.getElementById('signupDropLink');
    const loginDropLink = document.getElementById('loginDropLink');
    const referralLink = document.getElementById('referralLink');
    const storeLocatorLink = document.getElementById('storeLocatorLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                showNotification('Profile page - Coming soon!');
            } else {
                showNotification('Please login to view your profile');
                authModal.classList.add('active');
            }
            userDropdown.classList.remove('active');
        });
    }
    
    if (accountLink) {
        accountLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                showNotification('Account settings - Coming soon!');
            } else {
                showNotification('Please login to access account settings');
                authModal.classList.add('active');
            }
            userDropdown.classList.remove('active');
        });
    }
    
    if (signupDropLink) {
        signupDropLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                showNotification('You are already logged in');
            } else {
                // Switch to signup mode
                document.getElementById('authTitle').textContent = 'Sign Up';
                document.getElementById('authSubmit').textContent = 'Sign Up';
                document.getElementById('switchAuth').innerHTML = 'Already have an account? <a href="#">Login</a>';
                document.getElementById('nameGroup').style.display = 'block';
                authModal.classList.add('active');
            }
            userDropdown.classList.remove('active');
        });
    }
    
    if (loginDropLink) {
        loginDropLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                showNotification('You are already logged in');
            } else {
                // Switch to login mode
                document.getElementById('authTitle').textContent = 'Login';
                document.getElementById('authSubmit').textContent = 'Login';
                document.getElementById('switchAuth').innerHTML = 'Don\'t have an account? <a href="#">Sign up</a>';
                document.getElementById('nameGroup').style.display = 'none';
                authModal.classList.add('active');
            }
            userDropdown.classList.remove('active');
        });
    }
    
    if (referralLink) {
        referralLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn && isMember) {
                showNotification('Your referral code: MEMBER' + Math.floor(Math.random() * 10000) + ' - Share with friends!');
            } else if (isLoggedIn) {
                showNotification('Join our reseller program to get your referral code!');
                document.getElementById('membership').scrollIntoView({ behavior: 'smooth' });
            } else {
                showNotification('Please login to access the referral program');
                authModal.classList.add('active');
            }
            userDropdown.classList.remove('active');
        });
    }
    
    if (storeLocatorLink) {
        storeLocatorLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Store locator - Coming soon! We are expanding to your area.');
            userDropdown.classList.remove('active');
        });
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                handleLogout();
            } else {
                showNotification('You are not logged in');
            }
            userDropdown.classList.remove('active');
        });
    }
    
    // Membership signup button
    const signupBtn = document.getElementById('signupBtn');
    const membershipModal = document.getElementById('membershipModal');
    
    if (signupBtn && membershipModal) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                membershipModal.classList.add('active');
            } else {
                showNotification('Please login first to become a reseller');
                authModal.classList.add('active');
            }
        });
    }
    
    // Close modals
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.remove('active');
        });
    });
    
    // Close modal on outside click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Auth form switch
    const switchAuth = document.getElementById('switchAuth');
    const authTitle = document.getElementById('authTitle');
    const authSubmit = document.getElementById('authSubmit');
    const nameGroup = document.getElementById('nameGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    
    let isLoginMode = true;
    
    if (switchAuth) {
        switchAuth.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            
            if (isLoginMode) {
                authTitle.textContent = 'Login';
                authSubmit.textContent = 'Login';
                switchAuth.innerHTML = 'Don\'t have an account? <a href="#">Sign up</a>';
                nameGroup.style.display = 'none';
                phoneGroup.style.display = 'none';
            } else {
                authTitle.textContent = 'Sign Up';
                authSubmit.textContent = 'Sign Up';
                switchAuth.innerHTML = 'Already have an account? <a href="#">Login</a>';
                nameGroup.style.display = 'block';
                phoneGroup.style.display = 'block';
            }
        });
    }
    
    // Auth form submit
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuth(isLoginMode);
        });
    }
    
    // Membership form submit
    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleMembershipSignup();
        });
    }
    
    // Contact form submit
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            handleCheckout();
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Product Updates Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Notify Me buttons
    const notifyButtons = document.querySelectorAll('.notify-btn');
    notifyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.closest('.upcoming-card').querySelector('h3').textContent;
            if (isLoggedIn) {
                showNotification(`We'll notify you when ${productName} launches!`);
                button.textContent = 'Notification Set!';
                button.disabled = true;
            } else {
                showNotification('Please login to get launch notifications');
                document.getElementById('authModal').classList.add('active');
            }
        });
    });

    // Suggestion form
    const suggestionForm = document.getElementById('suggestionForm');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!isLoggedIn) {
                // Check if guest info is provided
                const guestName = suggestionForm.querySelector('.guest-name');
                const guestEmail = suggestionForm.querySelector('.guest-email');
                const guestPhone = suggestionForm.querySelector('.guest-phone');
                
                if (!guestName.value || !guestEmail.value || !guestPhone.value) {
                    showNotification('Please login or provide your full contact information (name, email, and phone) to submit a suggestion');
                    return;
                }
                
                showNotification(`Thank you ${guestName.value}! Your suggestion has been submitted.`);
            } else {
                showNotification('Thank you for your suggestion! We\'ll review it soon.');
            }
            
            suggestionForm.reset();
        });
    }

    // Bring Back buttons
    const bringBackButtons = document.querySelectorAll('.bring-back-btn');
    bringBackButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.dataset.product;
            
            if (!isLoggedIn) {
                const proceed = confirm(`Would you like to login to request ${productName}?\n\nClick OK to login or Cancel to continue as guest`);
                if (proceed) {
                    document.getElementById('authModal').classList.add('active');
                    return;
                } else {
                    // Show guest form for bring back request
                    showGuestRequestForm(productName, 'bringback');
                    return;
                }
            }
            
            showNotification(`Your request to bring back ${productName} has been recorded!`);
            button.textContent = 'Request Submitted';
            button.disabled = true;
        });
    });

    // Bring Back Request form
    const bringbackForm = document.getElementById('bringbackForm');
    if (bringbackForm) {
        bringbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!isLoggedIn) {
                const guestName = bringbackForm.querySelector('.guest-name');
                const guestEmail = bringbackForm.querySelector('.guest-email');
                const guestPhone = bringbackForm.querySelector('.guest-phone');
                
                if (!guestName.value || !guestEmail.value || !guestPhone.value) {
                    showNotification('Please login or provide your full contact information (name, email, and phone) to submit a request');
                    return;
                }
                
                showNotification(`Thank you ${guestName.value}! Your request has been submitted.`);
            } else {
                showNotification('Thank you! Your request has been submitted.');
            }
            
            bringbackForm.reset();
        });
    }

    // Vote buttons
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                const currentVotes = parseInt(button.textContent.match(/\d+/)[0]);
                button.innerHTML = `<i class="fas fa-thumbs-up"></i> ${currentVotes + 1}`;
                showNotification('Thanks for voting!');
                button.disabled = true;
            } else {
                showNotification('Please login to vote');
                document.getElementById('authModal').classList.add('active');
            }
        });
    });

    // Chat functionality
    const chatButton = document.getElementById('chatButton');
    const chatWidget = document.getElementById('chatWidget');
    const chatLoginModal = document.getElementById('chatLoginModal');
    const minimizeChat = document.getElementById('minimizeChat');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    const chatBtn = document.getElementById('chatBtn');
    
    // Open chat from button or nav icon
    function openChat() {
        if (!isChatActive) {
            chatLoginModal.classList.add('active');
        } else {
            chatWidget.classList.add('active');
            chatButton.style.display = 'none';
        }
    }
    
    if (chatButton) {
        chatButton.addEventListener('click', openChat);
    }
    
    if (chatBtn) {
        chatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openChat();
        });
    }
    
    if (minimizeChat) {
        minimizeChat.addEventListener('click', () => {
            chatWidget.classList.remove('active');
            chatButton.style.display = 'flex';
        });
    }
    
    // Chat login button
    const chatLoginBtn = document.getElementById('chatLoginBtn');
    if (chatLoginBtn) {
        chatLoginBtn.addEventListener('click', () => {
            chatLoginModal.classList.remove('active');
            if (isLoggedIn) {
                startChat();
            } else {
                document.getElementById('authModal').classList.add('active');
                showNotification('Please login to start chatting');
            }
        });
    }
    
    // Chat guest form
    const chatGuestForm = document.getElementById('chatGuestForm');
    if (chatGuestForm) {
        chatGuestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            chatUserName = document.getElementById('chatGuestName').value;
            chatUserEmail = document.getElementById('chatGuestEmail').value;
            chatUserPhone = document.getElementById('chatGuestPhone').value;
            
            if (chatUserName && chatUserEmail && chatUserPhone) {
                chatLoginModal.classList.remove('active');
                startChat(true);
            } else {
                showNotification('Please fill in all fields to continue');
            }
        });
    }
    
    // Start chat
    function startChat(isGuest = false) {
        isChatActive = true;
        chatWidget.classList.add('active');
        chatButton.style.display = 'none';
        chatInput.disabled = false;
        chatSend.disabled = false;
        
        // Welcome message
        setTimeout(() => {
            const userName = isGuest ? chatUserName : (localStorage.getItem('userEmail') || 'there');
            addBotMessage(`Great to have you here, ${userName}! How can I assist you with our beauty products, vitamins, or membership program?`);
        }, 1000);
        
        // Remove badge
        const badge = document.querySelector('.chat-badge');
        if (badge) badge.style.display = 'none';
    }
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addUserMessage(message);
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                getBotResponse(message);
            }, 1500);
        }, 500);
    }
    
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Add user message
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollChatToBottom();
    }
    
    // Add bot message
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollChatToBottom();
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="chat-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollChatToBottom();
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Get bot response
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = '';
        
        if (message.includes('product') || message.includes('buy')) {
            response = 'We offer beauty products (Mignonne™), vitamins (Nature™), personal care, and home care items. Would you like to browse our catalog or learn about specific products?';
        } else if (message.includes('member') || message.includes('reseller') || message.includes('sell')) {
            response = 'Our reseller membership is $99/year and gives you 20-30% wholesale pricing on all products. You can resell for profit! Would you like to sign up or learn more?';
        } else if (message.includes('price') || message.includes('cost')) {
            response = 'Our products range from $12.99 to $59.99. As a reseller member, you get wholesale prices 20-30% off. What category interests you?';
        } else if (message.includes('shipping') || message.includes('delivery')) {
            response = 'We offer free shipping on orders over $50. Standard delivery takes 3-5 business days. Express shipping is available at checkout.';
        } else if (message.includes('return') || message.includes('refund')) {
            response = 'We have a 30-day return policy for unopened products. Refunds are processed within 5-7 business days. Would you like help with a return?';
        } else if (message.includes('help') || message.includes('support')) {
            response = 'I\'m here to help! You can ask about products, membership, shipping, returns, or anything else. What would you like to know?';
        } else if (message.includes('thanks') || message.includes('thank you')) {
            response = 'You\'re welcome! Is there anything else I can help you with today?';
        } else {
            response = 'Thanks for reaching out! I can help you with product information, membership details, orders, or general questions. What would you like to know?';
        }
        
        addBotMessage(response);
    }
    
    // Scroll chat to bottom
    function scrollChatToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Get current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
}

// Handle authentication
function handleAuth(isLogin) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields');
        return;
    }
    
    if (!isLogin) {
        // Sign up validation - require name and phone
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        
        if (!fullName.trim()) {
            showNotification('Please enter your full name');
            return;
        }
        
        if (!phoneNumber.trim()) {
            showNotification('Please enter your phone number');
            return;
        }
        
        // Basic phone number validation
        const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phoneNumber)) {
            showNotification('Please enter a valid phone number');
            return;
        }
        
        // Store additional signup info
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userPhone', phoneNumber);
    }
    
    // Simulate authentication
    isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
    if (!isLogin) {
        const fullName = document.getElementById('fullName').value;
        showNotification(`Welcome ${fullName}! Account created successfully!`);
    } else {
        const savedName = localStorage.getItem('userName') || 'User';
        showNotification(`Welcome back ${savedName}!`);
    }
    
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('authForm').reset();
    updateUserInterface();
}

// Handle membership signup
function handleMembershipSignup() {
    // Simulate payment processing
    setTimeout(() => {
        isMember = true;
        localStorage.setItem('isMember', 'true');
        
        showNotification('Welcome to our Reseller Program! You now have access to wholesale pricing.');
        document.getElementById('membershipModal').classList.remove('active');
        document.getElementById('membershipForm').reset();
        updateUserInterface();
        
        // Refresh products to show wholesale prices
        displayProducts(currentFilter);
    }, 1000);
}

// Handle checkout
function handleCheckout() {
    if (!isLoggedIn) {
        showNotification('Please login to proceed with checkout');
        document.getElementById('authModal').classList.add('active');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simulate checkout process
    showNotification(`Processing order for $${total.toFixed(2)}...`);
    
    setTimeout(() => {
        showNotification('Order placed successfully! Thank you for your purchase.');
        cart = [];
        saveCart();
        updateCartCount();
        document.getElementById('cartModal').classList.remove('active');
    }, 2000);
}

// Update user interface based on login/membership status
function updateUserInterface() {
    const userBtn = document.getElementById('userBtn');
    const signupDropLink = document.getElementById('signupDropLink');
    const loginDropLink = document.getElementById('loginDropLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    const accountLink = document.getElementById('accountLink');
    
    if (isLoggedIn) {
        userBtn.innerHTML = '<i class="fas fa-user-check"></i>';
        userBtn.title = 'Account';
        
        // Show/hide appropriate menu items
        if (signupDropLink) signupDropLink.style.display = 'none';
        if (loginDropLink) loginDropLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'flex';
        if (profileLink) profileLink.style.display = 'flex';
        if (accountLink) accountLink.style.display = 'flex';
    } else {
        userBtn.innerHTML = '<i class="fas fa-user"></i>';
        userBtn.title = 'Login/Signup';
        
        // Show/hide appropriate menu items
        if (signupDropLink) signupDropLink.style.display = 'flex';
        if (loginDropLink) loginDropLink.style.display = 'flex';
        if (logoutLink) logoutLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
        if (accountLink) accountLink.style.display = 'none';
    }
    
    if (isMember) {
        // Show wholesale prices on products
        displayProducts(currentFilter);
    }
}

// Handle logout
function handleLogout() {
    isLoggedIn = false;
    isMember = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isMember');
    localStorage.removeItem('userEmail');
    
    showNotification('Logged out successfully');
    updateUserInterface();
    displayProducts(currentFilter);
}

// Show user menu (deprecated - kept for compatibility)
function showUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('active');
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #333;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show guest request form
function showGuestRequestForm(productName, requestType) {
    const existingModal = document.getElementById('guestRequestModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'guestRequestModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Continue as Guest</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem; color: #666;">Please provide your contact information to submit this request.</p>
                <form id="guestRequestForm">
                    <div class="form-group">
                        <input type="text" id="guestName" placeholder="Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="guestEmail" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="guestPhone" placeholder="Phone Number" required>
                    </div>
                    <input type="hidden" id="guestProductName" value="${productName}">
                    <input type="hidden" id="guestRequestType" value="${requestType}">
                    <button type="submit" class="btn btn-primary btn-block">Submit Request</button>
                </form>
                <p style="margin-top: 1rem; text-align: center; color: #666;">
                    Already have an account? <a href="#" id="guestLoginLink" style="color: var(--primary-color); font-weight: 600;">Login here</a>
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Login link handler
    const loginLink = modal.querySelector('#guestLoginLink');
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.remove();
        document.getElementById('authModal').classList.add('active');
    });
    
    // Form submit handler
    const guestForm = modal.querySelector('#guestRequestForm');
    guestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('guestName').value;
        const email = document.getElementById('guestEmail').value;
        const phone = document.getElementById('guestPhone').value;
        const product = document.getElementById('guestProductName').value;
        
        showNotification(`Thank you ${name}! Your request for ${product} has been submitted.`);
        modal.remove();
        
        // Update the button if it came from bring back button
        const bringBackBtn = Array.from(document.querySelectorAll('.bring-back-btn'))
            .find(btn => btn.dataset.product === product);
        if (bringBackBtn) {
            bringBackBtn.textContent = 'Request Submitted';
            bringBackBtn.disabled = true;
        }
    });
}

// Global variables for new features
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let comparison = JSON.parse(localStorage.getItem('comparison')) || [];

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Availability helper functions
function getAvailabilityClass(availability) {
    const classes = {
        'in-stock': 'in-stock',
        'low-stock': 'low-stock',
        'out-of-stock': 'out-of-stock',
        'discontinued': 'discontinued',
        'pre-order': 'pre-order'
    };
    return classes[availability] || 'unknown';
}

function getAvailabilityText(availability, stockCount) {
    const texts = {
        'in-stock': 'In Stock',
        'low-stock': 'Low Stock',
        'out-of-stock': 'Out of Stock',
        'discontinued': 'Discontinued',
        'pre-order': 'Pre-Order'
    };
    return texts[availability] || 'Unknown';
}

function getAvailabilityIcon(availability) {
    const icons = {
        'in-stock': 'fa-check-circle',
        'low-stock': 'fa-exclamation-triangle',
        'out-of-stock': 'fa-times-circle',
        'discontinued': 'fa-ban',
        'pre-order': 'fa-clock'
    };
    return icons[availability] || 'fa-question-circle';
}

// Product Quick View Modal
function openProductModal(productId) {
    const product = window.productsData.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const price = isMember ? product.wholesalePrice : product.price;
    const savings = product.price - product.wholesalePrice;
    
    document.getElementById('productModalTitle').textContent = product.name;
    document.getElementById('productModalName').textContent = product.name;
    document.getElementById('productModalCategory').textContent = getCategoryName(product.category);
    document.getElementById('productModalPrice').textContent = `$${price.toFixed(2)}`;
    document.getElementById('productModalDescription').textContent = product.description;
    document.getElementById('productModalIcon').className = `fas ${product.icon}`;
    
    if (isMember) {
        document.getElementById('productModalMemberPrice').style.display = 'block';
        document.getElementById('productModalMemberPrice').textContent = `Member: $${product.wholesalePrice.toFixed(2)}`;
        document.getElementById('productModalSavings').style.display = 'block';
        document.getElementById('productModalSavings').textContent = `You save: $${savings.toFixed(2)} (${Math.round(savings/product.price*100)}%)`;
    }
    
    // Update modal buttons
    const addToCartBtn = document.getElementById('addToCartModal');
    addToCartBtn.onclick = () => {
        const quantity = parseInt(document.getElementById('modalQuantity').value);
        for (let i = 0; i < quantity; i++) {
            addToCart(productId);
        }
        modal.classList.remove('active');
        showNotification('Product added to cart!');
    };
    
    const wishlistBtn = document.getElementById('addToWishlistModal');
    const isInWishlist = wishlist.some(item => item.id === productId);
    wishlistBtn.className = `btn btn-outline wishlist-btn ${isInWishlist ? 'active' : ''}`;
    wishlistBtn.onclick = () => toggleWishlist(productId);
    
    const compareBtn = document.getElementById('addToCompareModal');
    const isInComparison = comparison.some(item => item.id === productId);
    compareBtn.className = `btn btn-outline compare-btn ${isInComparison ? 'active' : ''}`;
    compareBtn.onclick = () => toggleCompare(productId);
    
    modal.classList.add('active');
}

// Quantity change for modal
function changeQuantity(change) {
    const quantityInput = document.getElementById('modalQuantity');
    const currentValue = parseInt(quantityInput.value);
    const newValue = Math.max(1, Math.min(10, currentValue + change));
    quantityInput.value = newValue;
}

// Wishlist functionality
function toggleWishlist(productId) {
    const product = window.productsData.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: isMember ? product.wholesalePrice : product.price,
            icon: product.icon,
            category: product.category
        });
        showNotification('Added to wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    updateProductCards();
}

// Comparison functionality
function toggleCompare(productId) {
    const product = window.productsData.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = comparison.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        comparison.splice(existingIndex, 1);
        showNotification('Removed from comparison');
    } else {
        if (comparison.length >= 3) {
            showNotification('You can only compare up to 3 products');
            return;
        }
        comparison.push({
            id: product.id,
            name: product.name,
            price: isMember ? product.wholesalePrice : product.price,
            icon: product.icon,
            category: product.category,
            description: product.description
        });
        showNotification('Added to comparison!');
    }
    
    localStorage.setItem('comparison', JSON.stringify(comparison));
    updateComparisonUI();
    updateProductCards();
}

// Update wishlist UI
function updateWishlistUI() {
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistBadge = document.getElementById('wishlistBadge');
    const wishlistItems = document.getElementById('wishlistItems');
    
    wishlistCount.textContent = wishlist.length;
    
    if (wishlist.length > 0) {
        wishlistBadge.textContent = wishlist.length;
        wishlistBadge.style.display = 'block';
        
        wishlistItems.innerHTML = wishlist.map(item => `
            <div class="wishlist-item">
                <div class="wishlist-item-icon">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <span class="wishlist-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="wishlist-item-actions">
                    <button onclick="addToCart(${item.id})" class="btn btn-sm btn-primary">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    <button onclick="toggleWishlist(${item.id})" class="btn btn-sm btn-outline">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        wishlistBadge.style.display = 'none';
        wishlistItems.innerHTML = `
            <div class="empty-wishlist-message">
                <i class="fas fa-heart"></i>
                <p>Your wishlist is empty</p>
                <p class="subtitle">Save products you love!</p>
            </div>
        `;
    }
}

// Update comparison UI
function updateComparisonUI() {
    const compareBadge = document.getElementById('compareBadge');
    const comparisonTable = document.getElementById('comparisonTable');
    
    if (comparison.length > 0) {
        compareBadge.textContent = comparison.length;
        compareBadge.style.display = 'block';
        
        comparisonTable.innerHTML = `
            <div class="comparison-header">
                <h4>Comparing ${comparison.length} Products</h4>
                <button onclick="clearComparison()" class="btn btn-outline btn-sm">Clear All</button>
            </div>
            <div class="comparison-grid">
                ${comparison.map(item => `
                    <div class="comparison-item">
                        <div class="comparison-item-image">
                            <i class="fas ${item.icon}"></i>
                        </div>
                        <h4>${item.name}</h4>
                        <div class="comparison-price">$${item.price.toFixed(2)}</div>
                        <p>${item.description}</p>
                        <div class="comparison-actions">
                            <button onclick="addToCart(${item.id})" class="btn btn-primary btn-sm">Add to Cart</button>
                            <button onclick="toggleCompare(${item.id})" class="btn btn-outline btn-sm">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        compareBadge.style.display = 'none';
        comparisonTable.innerHTML = `
            <div class="comparison-empty">
                <i class="fas fa-balance-scale"></i>
                <p>No products to compare yet</p>
                <p class="subtitle">Add products to comparison to see them here</p>
            </div>
        `;
    }
}

// Clear comparison
function clearComparison() {
    comparison = [];
    localStorage.setItem('comparison', JSON.stringify(comparison));
    updateComparisonUI();
    updateProductCards();
    showNotification('Comparison cleared');
}

// Search functionality
let searchTimeout;
function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const closeSearch = document.getElementById('closeSearch');
    const searchResults = document.getElementById('searchResults');
    
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });
    
    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchClear.style.display = 'none';
    });
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            searchClear.style.display = 'block';
        } else {
            searchClear.style.display = 'none';
        }
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchInput.focus();
        showSearchSuggestions();
    });
    
    // Search suggestions
    document.querySelectorAll('.suggestion-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.dataset.search;
            performSearch(tag.dataset.search);
        });
    });
    
    // Category links
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            searchOverlay.classList.remove('active');
            
            // Filter products by category
            document.querySelector(`[data-filter="${category}"]`).click();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function performSearch(query) {
    if (!query) {
        showSearchSuggestions();
        return;
    }
    
    const results = window.productsData.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(results, query);
}

function showSearchSuggestions() {
    document.getElementById('searchResults').innerHTML = `
        <div class="search-suggestions">
            <h4>Popular Searches</h4>
            <div class="suggestion-tags">
                <span class="suggestion-tag" data-search="serum">Face Serum</span>
                <span class="suggestion-tag" data-search="vitamins">Vitamins</span>
                <span class="suggestion-tag" data-search="moisturizer">Moisturizer</span>
                <span class="suggestion-tag" data-search="cleanser">Cleanser</span>
                <span class="suggestion-tag" data-search="supplements">Supplements</span>
            </div>
        </div>
        <div class="search-categories">
            <h4>Shop by Category</h4>
            <div class="category-links">
                <a href="#" class="category-link" data-category="beauty">
                    <i class="fas fa-sparkles"></i>
                    <span>Beauty Products</span>
                </a>
                <a href="#" class="category-link" data-category="vitamins">
                    <i class="fas fa-pills"></i>
                    <span>Vitamins & Supplements</span>
                </a>
                <a href="#" class="category-link" data-category="personal">
                    <i class="fas fa-pump-soap"></i>
                    <span>Personal Care</span>
                </a>
                <a href="#" class="category-link" data-category="home">
                    <i class="fas fa-home"></i>
                    <span>Home Care</span>
                </a>
            </div>
        </div>
    `;
    
    // Re-bind events
    document.querySelectorAll('.suggestion-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.getElementById('searchInput').value = tag.dataset.search;
            performSearch(tag.dataset.search);
        });
    });
    
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            document.getElementById('searchOverlay').classList.remove('active');
            document.querySelector(`[data-filter="${category}"]`).click();
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <h4>No results found for "${query}"</h4>
                <p>Try different keywords or browse our categories</p>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = `
        <div class="search-results-header">
            <h4>Found ${results.length} products for "${query}"</h4>
        </div>
        <div class="search-results-grid">
            ${results.map(product => `
                <div class="search-result-item" onclick="openProductModal(${product.id})">
                    <div class="search-result-icon">
                        <i class="fas ${product.icon}"></i>
                    </div>
                    <div class="search-result-info">
                        <h5>${product.name}</h5>
                        <p>${product.description}</p>
                        <div class="search-result-price">
                            $${(isMember ? product.wholesalePrice : product.price).toFixed(2)}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Cart Sidebar functionality
function setupCartSidebar() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        updateCartSidebar();
    });
    
    closeSidebar.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
    
    // Close on overlay click
    cartSidebar.addEventListener('click', (e) => {
        if (e.target === cartSidebar) {
            cartSidebar.classList.remove('active');
        }
    });
}

function updateCartSidebar() {
    const sidebarCartItems = document.getElementById('sidebarCartItems');
    const sidebarCartCount = document.getElementById('sidebarCartCount');
    const sidebarFooter = document.getElementById('sidebarFooter');
    const sidebarSubtotal = document.getElementById('sidebarSubtotal');
    const sidebarTotal = document.getElementById('sidebarTotal');
    
    sidebarCartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        sidebarCartItems.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p class="subtitle">Add some products to get started!</p>
            </div>
        `;
        sidebarFooter.style.display = 'none';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    sidebarCartItems.innerHTML = cart.map(item => `
        <div class="cart-sidebar-item">
            <div class="cart-item-icon">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="cart-item-price">
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart(${item.id})" class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    sidebarSubtotal.textContent = `$${total.toFixed(2)}`;
    sidebarTotal.textContent = `$${total.toFixed(2)}`;
    sidebarFooter.style.display = 'block';
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartSidebar();
    }
}

// Floating Action Buttons
function setupFloatingButtons() {
    const wishlistFloat = document.getElementById('wishlistFloat');
    const compareFloat = document.getElementById('compareFloat');
    const scrollTop = document.getElementById('scrollTop');
    
    wishlistFloat.addEventListener('click', () => {
        document.getElementById('wishlistSidebar').classList.add('active');
        updateWishlistUI();
    });
    
    compareFloat.addEventListener('click', () => {
        document.getElementById('compareModal').classList.add('active');
        updateComparisonUI();
    });
    
    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });
}

// Update product cards to reflect wishlist and comparison status
function updateProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.querySelector('.add-to-cart').getAttribute('onclick').match(/\d+/)[0]);
        
        const wishlistBtn = card.querySelector('.wishlist-btn');
        const compareBtn = card.querySelector('.compare-btn');
        
        if (wishlistBtn) {
            const isInWishlist = wishlist.some(item => item.id === productId);
            wishlistBtn.classList.toggle('active', isInWishlist);
        }
        
        if (compareBtn) {
            const isInComparison = comparison.some(item => item.id === productId);
            compareBtn.classList.toggle('active', isInComparison);
        }
    });
}

// Enhanced setup event listeners
function setupEnhancedEventListeners() {
    setupSearch();
    setupCartSidebar();
    setupFloatingButtons();
    
    // Close wishlist sidebar
    document.getElementById('closeWishlist').addEventListener('click', () => {
        document.getElementById('wishlistSidebar').classList.remove('active');
    });
    
    // Initialize UI
    updateWishlistUI();
    updateComparisonUI();
}

// Smooth scroll animations and intersection observer
function setupScrollAnimations() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animateElements = document.querySelectorAll('.product-card, .category-card, .membership-card, .upcoming-card, .stat');
    animateElements.forEach(el => observer.observe(el));
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setupEnhancedEventListeners();
    setupScrollAnimations();
});

// Make functions available globally
window.openProductModal = openProductModal;
window.changeQuantity = changeQuantity;
window.toggleWishlist = toggleWishlist;
window.toggleCompare = toggleCompare;
window.clearComparison = clearComparison;
window.updateCartQuantity = updateCartQuantity;

// Make addToCart and removeFromCart available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
