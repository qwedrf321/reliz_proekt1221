// ================== ЗАХИСТ ДЛЯ STORE.HTML ==================
const productsContainer = document.getElementById('products');
if (!productsContainer) {
    console.log('Catalog JS not needed on this page');
} else {

    let allProducts = [];
    let currentProducts = [];
    let currentPage = 1;
    const perPage = 30;

    const pageInfo = document.getElementById("pageInfo");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

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

    // ================== КОРЗИНА ==================
    class ShoppingCart {
        constructor() {
            this.items = {};
            this.loadCartFromCookies();
        }

        addItem(item) {
            if (this.items[item.title]) {
                this.items[item.title].quantity += 1;
            } else {
                this.items[item.title] = { ...item, quantity: 1 };
            }
            this.saveCartToCookies();
        }

        saveCartToCookies() {
            document.cookie = `cart=${JSON.stringify(this.items)}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }

        loadCartFromCookies() {
            const data = getCookieValue('cart');
            if (data) this.items = JSON.parse(data);
        }

        calculateTotal() {
            let total = 0;
            for (let key in this.items) {
                total += this.items[key].price * this.items[key].quantity;
            }
            return total;
        }
    }

    // ================== РЕНДЕР ==================
    function renderPage() {
        productsContainer.innerHTML = '';

        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        const pageItems = currentProducts.slice(start, end);

        pageItems.forEach(p => {
            productsContainer.innerHTML += `
                <div class="product">
                    <div class="product_img">
                        <img src="${p.image}" style="max-width:170px">
                    </div>
                    <div class="title">${p.title}</div>
                    <div class="prbt">
                        <div class="price">${p.price}₴</div>
                        <button 
                            class="buy_button"
                            data-product='${JSON.stringify(p)}'>
                            Купити
                        </button>
                    </div>
                </div>
            `;
        });

        const totalPages = Math.ceil(currentProducts.length / perPage);
        const pagination = document.querySelector('.pagination');

        // Скрываем пагинацию если нет результатов
        if (currentProducts.length === 0) {
            pagination.style.display = 'none';
            pageInfo.textContent = '0 / 0';
        } else {
            pagination.style.display = 'block';
            pageInfo.textContent = `${currentPage} / ${totalPages}`;
        }

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // ================== КНОПКИ ПАГІНАЦІЇ ==================
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth" // плавно
        });
    };

    nextBtn.onclick = () => {
        const totalPages = Math.ceil(currentProducts.length / perPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth" // плавно
        });
    };

    // ================== ФІЛЬТРИ ==================
    const filterLinks = document.querySelectorAll('.filter_list a[data-filter]');

    filterLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const category = link.dataset.filter;
            currentPage = 1;
            currentProducts = category === 'all'
                ? allProducts
                : allProducts.filter(p => p.category === category);
            renderPage();
            window.scrollTo({
                top: 0,
                behavior: "smooth" // плавно
            });
        });
    });

    // ================== ПОИСК ==================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            currentPage = 1;

            if (query === '') {
                currentProducts = allProducts;
            } else {
                currentProducts = allProducts.filter(p =>
                    p.title.toLowerCase().includes(query)
                );
            }

            renderPage();
        });
    }

    // ================== ДОДАВАННЯ В КОРЗИНУ (ДЕЛЕГУВАННЯ) ==================
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('buy_button')) {
            const productData = e.target.dataset.product;
            if (!productData) return;

            const product = JSON.parse(productData);
            cart.addItem(product);

            console.log('Added to cart:', cart.items);
        }
    });

    // ================== ЗАВАНТАЖЕННЯ ТОВАРІВ ==================
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            allProducts = shuffleArray([...data]); // перемешиваем
            currentProducts = allProducts;
            renderPage();
        });
}
