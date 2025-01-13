import { renderOrderSummary } from "./checkout/orderSummary.js";

import { renderPaymentSummary } from "./checkout/paymentSummary.js"

import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";

// import '../data/backend-practice.js';
import { loadProductsFetch } from "../data/products.js";

import { loadCart } from "../data/cart.js";

async function loadPage() {
    try {
        await loadProductsFetch()
        const value = await new Promise((resolve) => {
            loadCart(() => {
                resolve('value3');
            });
        });
    }
    catch (error) {
        console.log('Unexpected Error. Please try again later')
    }
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();


}
loadPage();




