export let cart;
loadFromLocalStorage();
export function loadFromLocalStorage() {
  cart = JSON.parse(localStorage.getItem('cart'))
  if (!cart) {
    cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '1'
    }, {
      productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
      quantity: 3,
      deliveryOptionId: '1'
    }]
  }
}

export function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((item) => {

    if (item.productId === productId) {
      matchingItem = item;
    }

  });

  let quantitySelect = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);


  if (matchingItem) {
    matchingItem.quantity += quantitySelect;
  } else {
    cart.push({
      productId: productId,
      quantity: quantitySelect,
      deliveryOptionId: '1'
    });
  }
  saveToLocalStorage();
}

export function removeItemsFromCart(productId) {

  cart.forEach((cartItem, index) => {
    if (cartItem.productId === productId) {
      cart.splice(index, 1);
      document.querySelector(`.js-cart-item-container-${productId}`).remove();
      saveToLocalStorage();
      return
    }
  })
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((item) => {

    if (item.productId === productId) {
      matchingItem = item;
    }
  });
  if (!matchingItem) {
    return
  }
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToLocalStorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {

    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}