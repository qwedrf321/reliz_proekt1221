// ================== COOKIES ==================
function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return '';
}

// ================== CART CLASS ==================
class ShoppingCart {
    constructor() {
        this.items = {};
        this.loadCart();
    }

    addItem(item) {
        if (this.items[item.title]) {
            this.items[item.title].quantity++;
        } else {
            this.items[item.title] = {
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: 1
            };
        }
        this.saveCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCart() {
        const data = localStorage.getItem('cart');
        if (data) this.items = JSON.parse(data);
    }

    clear() {
        this.items = {};
        this.saveCart();
    }

    getTotal() {
        return Object.values(this.items)
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
}

// ================== GLOBAL CART ==================
window.cart = new ShoppingCart();
