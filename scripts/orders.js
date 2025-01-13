import { generateOrderDate } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { cart } from "../data/cart-class.js";


function showCartQuantityOnHeader() {
  let cartQuantity = 0;
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  })
  console.log('cartQuantity', cartQuantity)
  let headerHTML = `
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
  document.querySelector('.js-order-header').innerHTML = headerHTML
}


export const orders = JSON.parse(localStorage.getItem('orders')) || [];
console.log('orders: ', orders)
let products = [];

async function loadProducts() {
  products = await loadProductsFetch()
}


export function addOrder(order) {
  orders.unshift(order)
  saveToStorage();
}
function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders))
}

let ordersHTML = ''

function renderOrders() {
  ordersHTML = ''
  function renderOrderContainer() {


    let matchingProductForOrder;

    orders.forEach((order) => {

      ordersHTML += `
        <div class="order-header js-order-header-${order.id}">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${generateOrderDate()}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid js-order-details-grid-${order.id}">
        `

      order.products.forEach((orderedProduct) => {
        products.forEach((product) => {
          if (orderedProduct.productId === product.id) {
            matchingProductForOrder = product;
          }
        })
        let formattedDeliveryTime = dayjs(orderedProduct.estimatedDeliveryTime).format('dddd, MMMM D')

        ordersHTML +=
          `
          <div class="product-image-container">
            <img src="${matchingProductForOrder.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingProductForOrder.name}
            </div>
            <div class="product-delivery-date">
              Delivery Date: ${formattedDeliveryTime}
            </div>
            <div class="product-quantity">
              Quantity: ${orderedProduct.quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${orderedProduct.productId}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message ">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${orderedProduct.productId}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>

    `;
      });
      ordersHTML += `</div>`
      console.log('MatchingProduct: ', matchingProductForOrder);
    });
  }
  
  renderOrderContainer();
  document.querySelector(`.js-order-container`).innerHTML = ordersHTML
  showCartQuantityOnHeader();
  document.querySelector('.js-search-bar').addEventListener('keydown', (event) => {

    if (event.key === 'Enter') {
      const search = document.querySelector('.js-search-bar').value;
      window.location.href = `index.html?search=${search}`;
    }
  });
  const buyAgainButtons = document.querySelectorAll('.js-buy-again-button')
  buyAgainButtons.forEach((buyAgainButton) => {
    buyAgainButton.addEventListener('click', () => {
      const productId = buyAgainButton.dataset.productId
      console.log('Product ID :', productId)
      console.log('cart', cart)
      cart.addToCart(productId)
      showCartQuantityOnHeader();
    })
  })
  
};
if (window.location.pathname.includes('orders.html')) {
  loadProducts().then(renderOrders);
}
