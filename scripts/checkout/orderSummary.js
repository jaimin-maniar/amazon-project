
import { loadProductsFetch, products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliverOptions, calculateDeliveryDate } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';
import { cart } from '../../data/cart-class.js';



loadProductsFetch().then(() => {
  renderOrderSummary();
})



export function renderOrderSummary() {
  renderCheckoutHeader();
  const today = dayjs();
  const deliveryDate = today.add(7, 'days')
  console.log(deliveryDate.format('dddd, MMMM D'))

  function updateCartSummaryHTML() {
    let cartSummaryHTML = '';
    cart.cartItems.forEach((cartItem) => {
      const productId = cartItem.productId;

      let matchingProduct = '';
      products.forEach((product) => {
        if (product.id === productId) {
          matchingProduct = product;
        }
      });


      const deliveryOptionId = cartItem.deliveryOptionId;

      let deliverOption = '';
      deliverOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
          deliverOption = option;
        }
      });


      const actualDeliveryDate = calculateDeliveryDate(deliverOption);

      cartSummaryHTML += `
             <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                      Delivery date: ${actualDeliveryDate}
                    </div>
        
                    <div class="cart-item-details-grid">
                      <img class="product-image"
                        src="${matchingProduct.image}">
        
                      <div class="cart-item-details">
                        <div class="product-name js-product-name-${matchingProduct.id}">
                        ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                          $${matchingProduct.getPrice()}
                        </div>
                        <div class="product-quantity ">
                          <span>
                            Quantity: <span class="quantity-label js-quantity-label js-product-quantity-${matchingProduct.id}" data-product-id="${matchingProduct.id}">${cartItem.quantity}</span>
                          </span>
                          <span>
                            <input type="number" class="quantity-input js-quantity-input" data-product-id="${matchingProduct.id}" value="${cartItem.quantity}">
                          </span>
                          <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                            Update
                          </span>
                          <span class="link-primary save-update-link js-save-button" data-product-id="${matchingProduct.id}">
                            Save
                          </span>
                          <span class="delete-quantity-link link-primary js-delete-button js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                            Delete
                          </span>
                        </div>
                      </div>
        
                      <div class="delivery-options">
                        <div class="delivery-options-title">
                          Choose a delivery option:
                        </div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                      </div>
                    </div>
                  </div>
            `;
    });
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML
    addEventListeners();
  }
  updateCartSummaryHTML();

  function addEventListeners() {

    // Delete Button Functionality
    document.querySelectorAll('.js-delete-button')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const productId = button.dataset.productId
          cart.removeItemsFromCart(productId);
          updateQuantityOnCheckout();
          renderPaymentSummary();
          renderCheckoutHeader();
          cart.saveToLocalStorage();
        })
      })



    // Update Button Functionality
    document.querySelectorAll('.js-update-quantity-link').forEach((updateLink) => {
      updateLink.addEventListener('click', () => {
        const productId = updateLink.dataset.productId;
        cart.cartItems.forEach((cartItem) => {
          if (cartItem.productId === productId) {
            document.querySelector(`.quantity-input[data-product-id="${productId}"]`).style.display = 'initial'
            document.querySelector(`.update-quantity-link[data-product-id="${productId}"]`).style.display = 'none'
            document.querySelector(`.js-save-button[data-product-id="${productId}"]`).style.display = 'initial'
            document.querySelector(`.js-quantity-label[data-product-id="${[productId]}"]`).style.display = 'none'
          }
        })
      })
    })

    // Save button functionality
    document.querySelectorAll('.save-update-link').forEach((saveLink) => {
      saveLink.addEventListener('click', () => {
        const productId = saveLink.dataset.productId;
        document.querySelector('.update-quantity-link').style.display = 'initial'
        document.querySelector('.js-save-button').style.display = 'none'
        document.querySelector('.quantity-input').style.display = 'none'
        document.querySelector(`.js-quantity-label[data-product-id="${productId}"]`).style.display = 'initial'
        const itemQuantity = 0;
        updateQuantityOnCheckout();
        renderPaymentSummary();
        renderCheckoutHeader();
        cart.saveToLocalStorage();
      })
    })

    document.querySelectorAll('.js-delivery-option').forEach((option) => {
      option.addEventListener('click', () => {
        const { productId, deliveryOptionId } = option.dataset
        cart.updateDeliveryOption(productId, deliveryOptionId)
        renderOrderSummary();
        renderPaymentSummary();
      })
    })
  }



  function updateQuantityOnCheckout() {
    let quantityInputs = document.querySelectorAll('.js-quantity-input')
    quantityInputs.forEach((input) => {
      let updateQuantityValue = Number(input.value);
      let productId = input.dataset.productId;
      cart.cartItems.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          cartItem.quantity = updateQuantityValue;
          updateCartSummaryHTML();
        }
      })
    })
  }

  function deliveryOptionsHTML(matchingProduct, cartItem) {

    let HTML = '';
    deliverOptions.forEach((deliveryOption) => {

      const dateString = calculateDeliveryDate(deliveryOption)
      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId
      HTML += `
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" 
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>`;
    })
    return HTML;
  }
}



