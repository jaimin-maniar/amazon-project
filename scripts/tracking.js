import { cart } from "../data/cart-class.js";
import { loadProductsFetch, products } from "../data/products.js";
import { orders } from "./orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'



let fetchedProducts = [];
async function loadTrackingProducts() {
    const fetchedProducts1 = await loadProductsFetch();
    fetchedProducts = fetchedProducts1
}
function renderOrderTracking() {

    function renderTrackingHeader() {
        let cartQuantity = 0;
        cart.cartItems.forEach((cartItem) => {
            cartQuantity += cartItem.quantity
        })

        let trackingHeader =
            `
    <div class="amazon-header-left-section">
      <a href="amazon.html" class="header-link">
        <img class="amazon-logo" src="images/amazon-logo-white.png">
        <img class="amazon-mobile-logo" src="images/amazon-mobile-logo-white.png">
      </a>
    </div>

    <div class="amazon-header-middle-section">
      <input class="search-bar js-search-bar" type="text" placeholder="Search">

      <button class="search-button js-search-button">
        <img class="search-icon" src="images/icons/search-icon.png">
      </button>
    </div>

    <div class="amazon-header-right-section">
      <a class="orders-link header-link" href="orders.html">
        <span class="returns-text">Returns</span>
        <span class="orders-text">& Orders</span>
      </a>

      <a class="cart-link header-link" href="checkout.html">
        <img class="cart-icon" src="images/icons/cart-icon.png">
        <div class="cart-quantity">${cartQuantity}</div>
        <div class="cart-text">Cart</div>
      </a>
    </div>
    `
        document.querySelector('.js-tracking-header').innerHTML = trackingHeader
    }
    renderTrackingHeader();



    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId')
    console.log(orderId)
    console.log(productId)
    console.log(fetchedProducts)


    let matchingProduct;
    let matchingOrder;
    let orderedProduct;

    function renderProductTracking() {
        fetchedProducts.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        orders.forEach((order) => {
            if (order.id === orderId) {
                order.products.forEach((orderProduct) => {
                    if (orderProduct.productId === productId) {
                        orderedProduct = orderProduct;
                        matchingOrder = order;
                    }
                });
            }
        });
        console.log(matchingProduct)
        const today = dayjs();
        const orderTime = dayjs(matchingOrder.orderTime);
        const deliveryTime = dayjs(orderedProduct.estimatedDeliveryTime);
        const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
        if (matchingProduct && orderedProduct) {
            let productTrackingHTML =
                `
        <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
        </a>

        <div class="delivery-date">
            Arriving on ${dayjs(orderedProduct.estimatedDeliveryTime).format('dddd, MMMM D')}
        </div>

        <div class="product-info">
            ${matchingProduct.name}
        </div>

        <div class="product-info">
            Quantity: ${orderedProduct.quantity}
        </div>

        <img class="product-image" src="${matchingProduct.image}">

        <div class="progress-labels-container">
            <div class="progress-label">
                Preparing
            </div>
            <div class="progress-label current-status">
                Shipped
            </div>
            <div class="progress-label">
                Delivered
            </div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${percentProgress}%"></div>
        </div>
        `;

            document.querySelector('.js-order-tracking').innerHTML = productTrackingHTML;
        }
    }
    renderProductTracking()
}
loadTrackingProducts().then(renderOrderTracking)
