let cart_list = document.querySelector('.cart-items-list')
let cart_total = document.querySelector('.cart-total')
let orderBtn = document.querySelector("#orderBtn")
let orderSection = document.querySelector(".order")

const clearBtn = document.getElementById('clearCartBtn');

function get_item(item) {
    return `
        <div class="cart-item">
            <img src="${item.image}" class="cart-item-img">
            <div class="cart-item-info">
                <div class = 'titquan'>
                    <p class="cart-item-title">${item.title}</p>
                </div>
                <div class = 'quan'>
                    <div class="cart-item-quantity">
                        Кількість: ${item.quantity}
                    </div>
                </div>
                <div class = 'prcbtn'>
                    <div class="cart-item-price">
                        ${item.price * item.quantity} грн
                    </div>
                </div>
                <div class = 'del_btn'>
                        <button class = 'delbtn'>vidalit</button>
                </div>
            </div>
        </div>
    `;
}


if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        cart.clear();
        showCartList();
    });
}

function showCartList() {
    cart_list.innerHTML = ''
    for (let key in cart.items) { // проходимося по всіх ключах об'єкта cart.items
        cart_list.innerHTML += get_item(cart.items[key])
    }
    cart_total.innerHTML = cart.getTotal()
    
    // Додаємо обробники для кнопок видалення
    document.querySelectorAll('.delbtn').forEach((btn, index) => {
        const keys = Object.keys(cart.items);
        btn.addEventListener('click', () => {
            const itemTitle = keys[index];
            delete cart.items[itemTitle];
            cart.saveCart();
            showCartList();
        });
    });
}

showCartList()

orderBtn.addEventListener("click", function (event) {
    orderBtn.style.display = "none"
    orderSection.style.display = "block"
    anime({
        targets: '.order',
        opacity: 1, // Кінцева прозорість (1 - повністю видимий)
        duration: 1000, // Тривалість анімації в мілісекундах
        easing: 'easeInOutQuad'
    })
})
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModal');

// открыть
function openModal() {
    modal.style.display = 'flex';
}

// закрыть
function closeModal() {
    modal.style.display = 'none';
    orderBtn.style.display = 'block';
}

closeBtn.onclick = closeModal;

// закрытие по клику вне окна
modal.onclick = (e) => {
    if (e.target === modal) closeModal();
};

// Обробка форми замовлення
const orderForm = document.querySelector('.order-form');
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            deliveryMethod: document.getElementById('deliveryMethod').value,
            address: document.getElementById('address').value,
            comment: document.getElementById('comment').value,
            items: cart.items,
            total: cart.getTotal()
        };
        
        console.log('Order submitted:', formData);
        
        // Відправка на сервер (якщо потрібно)
        // fetch('/api/orders', { method: 'POST', body: JSON.stringify(formData) })
        
        // Очищення корзини та закриття модалю
        cart.clear();
        closeModal();
        showCartList();
        orderBtn.style.display = 'block';
        
        // Показати повідомлення про успіх
        //alert('Ну і куда ті заказіваеш');
        window.location.href = 'https://youtu.be/dQw4w9WgXcQ?si=mmPsyCtptFB9mFvJ&t=40';
    });
}