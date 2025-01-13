export class Cart {
    cartItems = [];
    #localStorageKey;

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(`${this.#localStorageKey}`))
        if (!this.cartItems) {
            this.cartItems = [{
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

    saveToLocalStorage() {
        localStorage.setItem(`${this.#localStorageKey}`, JSON.stringify(this.cartItems));
    }

    addToCart(productId) {
        let matchingItem;

        this.cartItems.forEach((item) => {

            if (item.productId === productId) {
                matchingItem = item;
            }

        });
        let quantityElement = document.querySelector(`.js-quantity-selector-${productId}`)
        let quantitySelect = quantityElement && quantityElement.value ? Number(quantityElement.value) : 1

        if (matchingItem) {
            matchingItem.quantity += quantitySelect;
        } else {
            this.cartItems.push({
                productId: productId,
                quantity: quantitySelect,
                deliveryOptionId: '1'
            });
        }
        this.saveToLocalStorage();
    }

    removeItemsFromCart(productId) {

        this.cartItems.forEach((cartItem, index) => {
            if (cartItem.productId === productId) {
                this.cartItems.splice(index, 1);
                document.querySelector(`.js-cart-item-container-${productId}`).remove();
                this.saveToLocalStorage();
                return
            }
        })
    }

    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;

        this.cartItems.forEach((item) => {

            if (item.productId === productId) {
                matchingItem = item;
            }
        });
        if (!matchingItem) {
            return
        }
        matchingItem.deliveryOptionId = deliveryOptionId;
        this.saveToLocalStorage();
    }

    clearCart() {
        this.cartItems = [];
        this.saveToLocalStorage();
    }
}


export const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

















