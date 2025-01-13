import { cart } from "../../data/cart-class.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliverOptions } from "../../data/deliveryOptions.js";
import { addOrder } from "../../scripts/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'




export function generateOrderDate() {
    return dayjs().format('dddd, MMMM D');
}
export let totalForOrdersPafge = ''
export function renderPaymentSummary() {
    function generateBill() {
        let itemsCostOnBilling = 0;
        let shippingCostOnBilling = 0;
        let totalCostBeforeTaxOnBilling = 0;
        let totalTaxOnBilling = 0;
        let grandTotalOnBilling = 0;
        let cartQuantityOnPaymentSummary = 0;
        let taxRate = 0.1;

        function showItemsOnPaymentSummary() {
            cart.cartItems.forEach((cartItem) => {
                cartQuantityOnPaymentSummary += cartItem.quantity
            })
        }

        function calculateItemsCost() {
            let totalItemsCostInCents = 0;

            products.forEach((product) => {
                const productId = product.id;
                cart.cartItems.forEach((cartItem) => {
                    if (cartItem.productId === productId) {
                        totalItemsCostInCents += (product.priceCents * cartItem.quantity);
                        itemsCostOnBilling = totalItemsCostInCents;
                    }
                })

            })
        }

        function calculateShippingCost() {
            let shippingCost = 0;
            let shippingCostInCents = 0;
            cart.cartItems.forEach((cartItem) => {
                deliverOptions.forEach((deliveryOption) => {
                    if (deliveryOption.id === cartItem.deliveryOptionId) {
                        shippingCostInCents += deliveryOption.priceCents;
                        shippingCost = shippingCostInCents;
                        shippingCostOnBilling = shippingCost;
                    }
                })
            })
        }

        function calculateTotalCostBeforeTax() {
            totalCostBeforeTaxOnBilling = itemsCostOnBilling + shippingCostOnBilling
        }

        function calculateTax() {
            let totalTax = 0;
            totalTax = (taxRate * totalCostBeforeTaxOnBilling);
            totalTaxOnBilling = totalTax;
        }

        function calculateGrandTotal() {
            let grandTotal = 0;
            grandTotal = totalCostBeforeTaxOnBilling + totalTaxOnBilling
            grandTotalOnBilling = grandTotal;
            totalForOrdersPafge = `$${grandTotal}`
        }
        showItemsOnPaymentSummary();
        calculateItemsCost();
        calculateShippingCost();
        calculateTotalCostBeforeTax();
        calculateTax();
        calculateGrandTotal();


        let paymentSummaryHTML = '';
        function updateDocumentForBill() {
            paymentSummaryHTML =
                `
            <div class="payment-summary-title">
                Order Summary
            </div>

            <div class="payment-summary-row">
            <div>Items (${cartQuantityOnPaymentSummary}):</div>
            <div class="payment-summary-money">$${formatCurrency(itemsCostOnBilling)}</div>
            </div>

            <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingCostOnBilling)}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCostBeforeTaxOnBilling)}</div>
            </div>
            
            <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(totalTaxOnBilling)}</div>
            </div>
            
            <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(grandTotalOnBilling)}</div>
            </div>

            <button class="place-order-button button-primary js-order-button">
                Place your order
            </button>
            `
        }
        updateDocumentForBill();
        document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    }
    generateBill();

    if (cart.cartItems.length === 0) {
        let viewProductsHTML =
            `
            <a href="./index.html">
            <button class="view-products-button">
                View Products
            </button>
            </a>
            `
        document.querySelector('.js-order-summary').innerHTML = viewProductsHTML;
    }
    document.querySelector('.js-order-button').addEventListener('click', async () => {
        if (cart.cartItems.length > 0) {
            try {
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cart: cart
                    })
                });

                const order = await response.json();
                console.log(order)
                addOrder(order);
                cart.clearCart();

            }
            catch {
                console.log('Unexpected Error')
            }
            window.location.href = 'orders.html';
        } else {
            alert('Please add products to Cart')

        }
    });
}
