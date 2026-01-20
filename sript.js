const productsContainer = document.getElementById('products');
let allProducts = [];

fetch('products.json')
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        renderProducts(allProducts);
    });
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';');

    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
    return '';
}
function renderProducts(products) {
    productsContainer.innerHTML = '';

    products.forEach(p => {
        productsContainer.innerHTML += `
            <div class="product" data-category="${p.category}">
                <div class="product_img">
                    <img src="${p.image}" style="max-width:170px">
                </div>
                <div class="title">${p.title}</div>
                <div class="prbt">
                    <div class="price">${p.price}₴</div>
                    <button class="buy_button"data-product='${JSON.stringify(p)}>Купити</button>
                </div>
            </div>
        `;
    });
}
document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();

        const category = btn.dataset.filter;

        if (category === 'all') {
            renderProducts(allProducts);
        } else {
            const filtered = allProducts.filter(
                p => p.category === category
            );
            renderProducts(filtered);
        }
    });
});
// ================== ПАГИНАЦИЯ ==================
const productContainer = document.getElementById('products');
const pageInfo = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let allproducts = [];
let currentProducts = [];
let currentPage = 1;
const perPage = 48;

// ===== ЗАГРУЗКА =====
fetch('products.json')
    .then(res => res.json())
    .then(data => {
        allproducts = data;
        currentProducts = allproducts;
        renderPage();
    });

// ===== РЕНДЕР СТРАНИЦЫ =====
function renderPage() {
    productContainer.innerHTML = '';

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageItems = currentProducts.slice(start, end);

    pageItems.forEach(p => {
        productContainer.innerHTML += `
            <div class="product">
                <div class="product_img">
                    <img src="${p.image}" style="max-width:170px">
                </div>
                <div class="title">${p.title}</div>
                <div class="prbt">
                    <div class="price">${p.price}₴</div>
                    <button class="buy_button">Купити</button>
                </div>
            </div>
        `;
    });

    const totalPages = Math.ceil(currentProducts.length / perPage);
    pageInfo.textContent = `${currentPage} / ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// ===== КНОПКИ =====
prevBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
};

nextBtn.onclick = () => {
    const totalPages = Math.ceil(currentProducts.length / perPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage();
    }
};

// ===== ФИЛЬТР =====
document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();

        const category = btn.dataset.filter;
        currentPage = 1;

        currentProducts = category === 'all'
            ? allproducts
            : allproducts.filter(p => p.category === category);

        renderPage();
    });
});
//-----------
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

fetch('products.json')
    .then(res => res.json())
    .then(data => {
        allProducts = data;

        shuffle(allProducts); // ← ВОТ ЭТО ГЛАВНОЕ

        currentProducts = allProducts;
        renderPage();
    });

function smartShuffle(products) {
    for (let round = 0; round < 5; round++) {
        products.sort(() => Math.random() - 0.5);
    }

    for (let i = 2; i < products.length; i++) {
        const a = products[i].category;
        const b = products[i - 1].category;
        const c = products[i - 2].category;

        if (a === b && b === c) {
            const swapIndex = Math.floor(Math.random() * i);
            [products[i], products[swapIndex]] = [products[swapIndex], products[i]];
        }
    }
}

smartShuffle(allProducts);
currentProducts = allProducts;
renderPage();
//dobavlenie v korzinu
// Отримуємо всі кнопки "Купити" на сторінці
let buyButtons = document.querySelectorAll('.buy_button');
// Навішуємо обробник подій на кожну кнопку "Купити"
if (buyButtons) {
    buyButtons.forEach(function (button) {
        button.addEventListener('click', addToCart);
    });
}

// Створення класу кошика
class ShoppingCart {
    constructor() {
        this.items = {};
        this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
    }

    // Додавання товару до кошика
    addItem(item) {
        if (this.items[item.title]) {
            this.items[item.title].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
        } else {
            this.items[item.title] = item; // Якщо товару немає в кошику, додаємо його
            this.items[item.title].quantity = 1;
        }
        this.saveCartToCookies();
    }


    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
        }
    }
    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
        let total = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
        }
        return total;
    }
}

// Створення об'єкта кошика 
let cart = new ShoppingCart();


// Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('data-product');
    const product = JSON.parse(productData);
    console.log(cart);
    

    // Додаємо товар до кошика

    cart.addItem(product);
    console.log(cart);

}