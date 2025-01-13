
import { cart } from '../data/cart-class.js';
import { products } from '../data/products.js'
import { loadProductsFetch } from '../data/products.js';

loadProductsFetch().then(() => {
  renderProductsGrid();
})

function renderProductsGrid() {

  let productsHTML = ''
  let intervalId = {};

  const productGrid = document.querySelector('.js-product-grid')
  if (productGrid) {
    const url = new URL(window.location.href)
    const search = url.searchParams.get('search');

    let filteredProducts = products

    if (search) {
      filteredProducts = products.filter((product) => {
        return product.name.includes(search);
      });
    }

    filteredProducts.forEach((product) => {


      productsHTML += `
    <div class="product-container">  
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>
  
          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>
  
          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>
  
          <div class="product-price">
            $${product.getPrice()}
          </div>
  
          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          
          ${product.extraInfoHTML()}
          ${product.extraHTMLforInstructionsAndWarranty()}
          
  
          <div class="product-spacer"></div>
  
          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>
  
          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
    </div>`
    });
  }

  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.cartItems.forEach((product) => {
      cartQuantity += product.quantity
      console.log(cartQuantity);
    })
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }
  updateCartQuantity();

  function showAddedToCart(productId) {
    let addedToCart = document.querySelectorAll(`.js-added-to-cart-${productId}`);

    addedToCart.forEach((element) => {
      element.style.opacity = '1';
    })

    if (intervalId[productId]) {
      clearTimeout(intervalId[productId]);
    }

    intervalId[productId] = setTimeout(() => {
      addedToCart.forEach((element) => {
        element.style.opacity = '0';
      })
    }, 2000)
  }


  document.querySelector('.js-product-grid').innerHTML = productsHTML;


  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        cart.addToCart(productId);

        updateCartQuantity();

        showAddedToCart(productId);

      })
    })

  console.log(cart)
  const searchButton = document.querySelector('.js-search-button');
  searchButton.addEventListener('click', () => {
    const search = document.querySelector('.js-search-bar').value;
    window.location.href = `amazon.html?search=${search}`;
  });
  document.querySelector('.js-search-bar').addEventListener('keydown', (event) => {

    if (event.key === 'Enter') {
      const search = document.querySelector('.js-search-bar').value;
      window.location.href = `jaimin-maniar.github.io/amazon-project/amazon.html?search=${search}`;
    }
  });
}
